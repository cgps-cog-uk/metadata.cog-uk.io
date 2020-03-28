/* eslint no-unused-vars: 0 */

const express = require("express");

const { catchErrorResponse } = require("../errors");
const requireUser = require("./require-user");

const apiRouter = express.Router();

apiRouter
  .use("/authenticate", require("./authenticate"))
  .use("/data", requireUser, require("./data"))
  .use("/downloads", requireUser, require("./downloads"))
  .use((err, req, res, next) => {
    catchErrorResponse(res, err);
  });

module.exports = apiRouter;
