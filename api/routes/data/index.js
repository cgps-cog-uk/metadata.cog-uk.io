const express = require("express");

const router = express.Router();

router.use(
  "/submit",
  require("./submit")
);

module.exports = router;
