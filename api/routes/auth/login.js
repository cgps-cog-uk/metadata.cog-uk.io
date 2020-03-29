const jsonwebtoken = require("jsonwebtoken");

const climbApi = require("../../utils/climb-api");
const config = require("../../utils/config");

module.exports = async function (req, res, next) {
  const { username, token } = req.body;
  const valid = await climbApi.authenticate(username, token);

  if (!valid) {
    res.status(400).send("Invalid credentials");
  }

  const accessToken = jsonwebtoken.sign(
    {
      username,
      token,
    },
    config.secret,
    {}
  );

  res.json({
    token: accessToken,
  });
};
