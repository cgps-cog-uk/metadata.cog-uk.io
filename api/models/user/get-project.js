const config = require("../../utils/config");

module.exports = function () {
  return this.project || config.epicollect;
};
