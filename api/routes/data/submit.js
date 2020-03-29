/* eslint "no-throw-literal": 0 */

const climbApi = require("../../utils/climb-api");

async function submitData(username, token, data) {
  const [ sample ] = data;

  let success;
  const messages = {};

  const biosamplesResults = await climbApi.createOrUpdateBiosamples(username, token, data);
  success = biosamplesResults.success;
  if (biosamplesResults.messages.length) {
    Object.assign(messages, biosamplesResults.messages[0]);
  }

  if (biosamplesResults.success) {
    if (sample.library_name) {
      const libraryResults = await climbApi.createOrUpdateLibrary(username, token, data);
      success = success && libraryResults.success;
      if (libraryResults.messages.length) {
        Object.assign(messages, libraryResults.messages[0]);
      }
    }
    if (sample.run_name) {
      const sequencingResults = await climbApi.createOrUpdateSequencing(username, token, data);
      success = success && sequencingResults.success;
      if (sequencingResults.messages.length) {
        Object.assign(messages, sequencingResults.messages[0]);
      }
    }
  }

  return {
    success,
    messages: [ messages ],
  };
}

module.exports = function (req, res, next) {
  console.info("Got request to create or update biosample data");

  Promise.resolve(req)
    .then(({ user, body }) => submitData(user.username, user.token, body.biosamples))
    .then((results) => {
      res.send({ ok: results.success, messages: results.messages });
    })
    .catch((error) => {
      res
        .status(400)
        .send({
          error: error.message,
          code: error.response.status,
          status: error.response.statusText,
          data: error.response.data,
        });
    });
};
