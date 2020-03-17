/* eslint no-unused-vars: 0 */

const express = require("express");

const { catchErrorResponse } = require("../errors");

const apiRouter = express.Router();

apiRouter
  .use("/data", require("./data"))
  .use((err, req, res, next) => {
    catchErrorResponse(res, err);
  });

module.exports = apiRouter;
