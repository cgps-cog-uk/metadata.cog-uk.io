const climbApi = require("../utils/climb-api");

module.exports = function (req, res, next) {
  Promise.resolve(req.body)
    .then((data) => climbApi.createOrUpdateBiosamples(data.username, data.token, [{}]))
    .then(() => {
      res.send({ ok: true });
    })
    .catch(() => {
      res.sendStatus(400);
    });
};
