/* eslint "no-throw-literal": 0 */

const axios = require("axios");
const moment = require("moment");

const config = require("../../utils/config");
const uuid = require("../../utils/uuid");

async function createEntryData(req) {
  const projectDef = req.projectDef;

  const rawValues = req.body;
  const version = projectDef.meta.project_stats.structure_last_updated;
  const formIndex = 0;
  const formRef = projectDef.meta.project_extra.project.forms[formIndex];
  const entryId = uuid();

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
      device_id: "web",
      platform: "COG-UK.IO",
      title: null,
      answers: {},
      project_version: version,
    },
  };

  const titles = [];

  for (const input of projectDef.data.project.forms[formIndex].inputs) {
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

  for (const input of projectDef.data.project.forms[formIndex].inputs) {
    const rawValue = rawValues[input.question.toLowerCase()];
    if (input.is_required) {
      if (!rawValue) {
        throw {
          message: `Question ${input.question} is required.`,
          field: input.question.toLowerCase(),
        };
      }
    }
    const answer = {
      was_jumped: false,
      answer: "",
    };
    if (rawValue) {
      if (input.is_title) {
        titles.push(rawValue);
      }
      if (input.type === "radio") {
        const foundAsnwer = input.possible_answers.find((x) => x.answer.toLowerCase() === rawValue.toLowerCase());
        if (foundAsnwer) {
          answer.answer = foundAsnwer.answer_ref;
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
      else {
        answer.answer = rawValue;
      }
    }
    data.entry.answers[input.ref] = answer;
  }

  data.entry.title = (
    titles.length
      ?
      titles.join(" ")
      :
      `${projectDef.data.project.forms[formIndex].name} ${entryId}`
  );

  req.projectDef = projectDef;
  req.formDef = projectDef.data.project.forms[formIndex];
  return data;
}

function sendEntryRequest(data) {
  return axios({
    method: "POST",
    url: config["epicollect-upload-endpoint"],
    headers: {
      "Content-Type": "application/vnd.api+json",
    },
    data: { data },
  });
}

module.exports = function (req, res, next) {
  console.info("Got request to create data");

  Promise.resolve(req)
    .then(createEntryData)
    .then(sendEntryRequest)
    .then((done) => {
      res.send({ ok: true });
    })
    .catch((err) => {
      let error = err;
      if (err.response && err.response.data) {
        if (err.response.data.errors && err.response.data.errors[0]) {
          error = err.response.data.errors[0];
          if (error.source) {
            const input = req.formDef.inputs.find((x) => x.ref === error.source);
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
      else if (err.message && !err.field) {
        error = err.message;
      }
      res
        .status(400)
        .send({ ok: false, error });
    });
};
