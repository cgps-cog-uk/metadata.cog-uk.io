/* eslint "no-throw-literal": 0 */

const moment = require("moment");

const climbApi = require("../../utils/climb-api");

module.exports = function (req, res, next) {
  console.info("Got request to create data");

  Promise.resolve(req.body)
    .then((data) => climbApi.createBiosamples(data.username, data.token, data.biosamples))
    .then(() => {
      res.send({ ok: true });
    })
    .catch((err) => {
      const error = err;
      res
        .status(400)
        .send({ ok: false, error });
    });
};
