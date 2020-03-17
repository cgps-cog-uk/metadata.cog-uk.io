const axios = require("axios");

const config = require("../../utils/config");
const uuid = require("../../utils/uuid");

async function createEntryData(rawVales) {
  const { data: projectDef } = await axios.get(config["epicollect-project-endpoint"]);
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
      title: `${projectDef.data.project.forms[formIndex].name} ${entryId}`,
      answers: {},
      project_version: version,
    },
  };
  for (const input of projectDef.data.project.forms[formIndex].inputs) {
    const rawValue = rawVales[input.question];
    if (input.is_required) {
      if (!rawValue) {
        throw new Error(`Question ${input.question} is required.`);
      }
    }
    const answer = {
      was_jumped: false,
      answer: "",
    };
    if (rawValue) {
      if (input.type === "radio") {
        const foundAsnwer = input.possible_answers.find((x) => x.answer === rawValue);
        if (foundAsnwer) {
          answer.answer = foundAsnwer.answer_ref;
        }
        else {
          throw new Error(`Invalid answer ${rawValue} for question ${input.question}.`);
        }
      }
      else {
        answer.answer = rawValue;
      }
    }
    data.entry.answers[input.ref] = answer;
  }
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

  Promise.resolve(req.body)
    .then(createEntryData)
    .then(sendEntryRequest)
    .then((done) => {
      res.send({ ok: true });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ ok: false, error: (err.response && err.response.data) ? err.response.data : (err.message || err) });
    });
};
