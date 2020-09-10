/* eslint no-unused-vars: 0 */

const express = require("express");

const { catchErrorResponse, StatusCodeError } = require("../errors");

const apiRouter = express.Router();

apiRouter
  // .use("/auth", require("./auth"))
  .use("/data", require("./data"))
  .use("/downloads", require("./downloads"))
  .use((req, res) => res.sendStatus(404))
  .use((err, req, res, next) => {
    catchErrorResponse(res, err);
  });

module.exports = apiRouter;
