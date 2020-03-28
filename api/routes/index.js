/* eslint no-unused-vars: 0 */

const express = require("express");

const { catchErrorResponse, StatusCodeError } = require("../errors");

const apiRouter = express.Router();

function requireCredentials(req, res, next) {
  if (!req.body.username || !req.body.token) {
    throw new StatusCodeError(401); // Unauthorized: User must be authenticated
  }

  next();
}

apiRouter
  .use("/authenticate", require("./authenticate"))
  .use("/data", requireCredentials, require("./data"))
  .use("/downloads", requireCredentials, require("./downloads"))
  .use((err, req, res, next) => {
    catchErrorResponse(res, err);
  });

module.exports = apiRouter;
