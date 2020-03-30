/* eslint "no-throw-literal": 0 */

const coguk = require("cog-uk.js");

module.exports = function (req, res, next) {
  console.info("Got request to create or update biosample data");
  const client = coguk(req.user.username, req.user.token);

  Promise.resolve(req.body)
    .then((sample) => {
      return client.submit(sample);
    })
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      res
        .status(400)
        .send(error);
    });
};
