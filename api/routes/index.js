/* eslint no-unused-vars: 0 */

const express = require("express");

const { catchErrorResponse } = require("../errors");
const auth = require("./auth");

const apiRouter = express.Router();

apiRouter
  .use(auth)
  .use("/data", require("./data"))
  .use("/downloads", require("./downloads"))
  .use((err, req, res, next) => {
    catchErrorResponse(res, err);
  });

module.exports = apiRouter;
