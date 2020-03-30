/* eslint "no-throw-literal": 0 */

const climbApi = require("../../utils/climb-api");

async function submitData(username, token, sample) {
  let success;
  const messages = {};

  const biosamplesResults = await climbApi.createOrUpdateBiosamples(username, token, [ sample ]);
  success = biosamplesResults.success;
  if (biosamplesResults.messages.length) {
    Object.assign(messages, biosamplesResults.messages[0]);
  }

  if (biosamplesResults.success) {
    if (sample.library_name) {
      const libraryResults = await climbApi.createOrUpdateLibrary(username, token, [ sample ]);
      success = success && libraryResults.success;
      if (libraryResults.messages.length) {
        Object.assign(messages, libraryResults.messages[0]);
      }
    }
    if (sample.run_name) {
      const sequencingResults = await climbApi.createOrUpdateSequencing(username, token, [ sample ]);
      success = success && sequencingResults.success;
      if (sequencingResults.messages.length) {
        Object.assign(messages, sequencingResults.messages[0]);
      }
    }
  }

  return {
    success,
    messages,
  };
}

module.exports = function (req, res, next) {
  console.info("Got request to create or update biosample data");

  Promise.resolve(req)
    .then(({ user, body }) => submitData(user.username, user.token, body))
    .then((results) => {
      res.send({ ok: results.success, messages: results.messages });
    })
    .catch((error) => {
      res
        .status(400)
        .send({
          error: error.message,
          code: error.response ? error.response.status : undefined,
          status: error.response ? error.response.statusText : undefined,
          data: error.response ? error.response.data : undefined,
        });
    });
};
