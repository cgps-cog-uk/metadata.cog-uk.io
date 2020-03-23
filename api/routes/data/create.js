/* eslint "no-throw-literal": 0 */

const moment = require("moment");

const EntryCache = require("../../models/entry-cache");
const uuid = require("../../utils/uuid");
const epicollectApi = require("../../utils/epicollect");

async function createEntryId(project, rawValues) {
  const newId = uuid();
  if (project.uniqueIdField) {
    const doc = await EntryCache.findOneOrCreate(
      {
        projectId: project.id,
        localId: rawValues[project.uniqueIdField],
      },
      {
        projectId: project.id,
        localId: rawValues[project.uniqueIdField],
        entryId: newId,
      }
    );
    return doc.entryId;
  }
  else {
    return newId;
  }
}

async function createEntryData(project, projectDefinition, rawValues) {
  const version = projectDefinition.meta.project_stats.structure_last_updated;
  const formIndex = 0;
  const formRef = projectDefinition.data.project.forms[formIndex].ref;
  const entryId = await createEntryId(project, rawValues);

  const data = {
    type: "entry",
    id: entryId,
    attributes: {
      form: {
        ref: formRef,
        type: "hierarchy",
      },
    },
    relationships: {
      parent: {},
      branch: {},
    },
    entry: {
      entry_uuid: entryId,
      created_at: (new Date()).toISOString(),
      device_id: "cog-uk.io",
      platform: "API",
      title: null,
      answers: {},
      project_version: version,
    },
  };

  const titles = [];

  for (const input of projectDefinition.data.project.forms[formIndex].inputs) {
    if (input.type === "date") {
      const questionFieldname = input.question.toLowerCase();
      if (!rawValues[questionFieldname]) {
        const rawYearValue = rawValues[`${questionFieldname} year`];
        const rawMonthValue = rawValues[`${questionFieldname} month`];
        const rawDayValue = rawValues[`${questionFieldname} day`];
        if (rawYearValue) {
          rawValues[questionFieldname] = `${rawYearValue}-${rawMonthValue}-${rawDayValue}`;
        }
      }
    }
  }

  let wasJumped = false;
  for (const input of projectDefinition.data.project.forms[formIndex].inputs) {
    const answer = {
      question: input.question.toLowerCase(),
      was_jumped: wasJumped,
      answer: "",
    };
    data.entry.answers[input.ref] = answer;
    if (wasJumped) {
      continue;
    }
    const rawValue = rawValues[input.question.toLowerCase()];
    if (input.is_required) {
      if (!rawValue) {
        throw {
          message: `Question ${input.question} is required.`,
          field: input.question.toLowerCase(),
        };
      }
    }
    if (rawValue) {
      if (input.is_title) {
        titles.push(rawValue);
      }
      if (input.type === "radio" || input.type === "dropdown") {
        const foundAsnwer = input.possible_answers.find((x) => x.answer.toLowerCase() === rawValue.toLowerCase());
        if (foundAsnwer) {
          answer.answer = foundAsnwer.answer_ref;
          if (input.jumps.length && input.jumps[0].answer_ref === foundAsnwer.answer_ref) {
            wasJumped = true;
          }
        }
        else {
          throw {
            message: `Invalid answer ${rawValue} for question ${input.question}.`,
            field: input.question.toLowerCase(),
          };
        }
      }
      else if (input.type === "date") {
        const momentValue = moment(rawValue);
        if (momentValue.isValid()) {
          answer.answer = momentValue.toISOString();
        }
        else {
          throw {
            message: `Invalid date value ${rawValue} for question ${input.question}.`,
            field: input.question.toLowerCase(),
          };
        }
      }
      else if (input.type === "barcode" || input.type === "text" || input.type === "integer") {
        answer.answer = rawValue;
      }
      else {
        throw { message: `Invalid input type of ${input.type}` };
      }
    }
  }

  data.entry.title = (
    titles.length
      ?
      titles.join(" ")
      :
      `${projectDefinition.data.project.forms[formIndex].name} ${entryId}`
  );

  return data;
}

async function createEntry(req) {
  const project = req.user.getProject();
  const projectDefinition = await epicollectApi.getProjectDefinition(project);

  const data = await createEntryData(project, projectDefinition, req.body);
  const formDef = projectDefinition.data.project.forms[0];

  return (
    epicollectApi.createEntry(project, data)
      .catch((error) => {
        error.formDef = formDef;
        throw error;
      })
  );
}

function handleErrors(err) {
  let error = err;
  if (err.response && err.response.data) {
    if (err.response.data.errors && err.response.data.errors[0]) {
      error = err.response.data.errors[0];
      error.message = error.title;
      if (error.source) {
        const input = err.formDef.inputs.find((x) => x.ref === error.source);
        if (input) {
          error = {
            message: error.title,
            field: input.question.toLowerCase(),
          };
        }
      }
    }
    else {
      error = err.response.data;
    }
  }
  else if (err instanceof Error) {
    error = err.message;
  }

  return error;
}

module.exports = function (req, res, next) {
  console.info("Got request to create data");

  Promise.resolve(req)
    .then(createEntry)
    .then(() => {
      res.send({ ok: true });
    })
    .catch((err) => {
      const error = handleErrors(err);
      res
        .status(400)
        .send({ ok: false, error });
    });
};
