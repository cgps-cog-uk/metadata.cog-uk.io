const express = require("express");

const router = express.Router();

router.use(
  "/create_update_biosample",
  require("./createOrUpdateBiosample")
);

router.use(
  "/create_update_library",
  require("./createOrUpdateLibrary")
);

router.use(
  "/create_update_sequencing",
  require("./createOrUpdateSequencing")
);

module.exports = router;
