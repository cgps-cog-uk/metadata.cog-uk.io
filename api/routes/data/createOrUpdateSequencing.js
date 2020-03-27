/* eslint "no-throw-literal": 0 */

const moment = require("moment");

const climbApi = require("../../utils/climb-api");

module.exports = function (req, res, next) {
  console.info("Got request to create or update sequencing data");

  Promise.resolve(req.body)
    .then((data) => climbApi.createOrUpdateSequencing(data.username, data.token, data.sequencing))
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
