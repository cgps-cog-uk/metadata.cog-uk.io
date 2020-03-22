const express = require("express");

const router = express.Router();

router.use(
  "/template",
  require("./template")
);

module.exports = router;
