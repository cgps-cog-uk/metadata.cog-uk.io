const express = require("express");
const bodyParser = require("body-parser");

const config = require("./utils/config");

const app = express();

app.use(
  bodyParser.json({ limit: "500mb" })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  })
);

app.use((req, res, next) => {
  req.config = config;
  next();
});

app.use("/api", require("./routes"));

module.exports = app;
