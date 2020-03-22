const config = require("../../utils/config");

module.exports = function () {
  return this.epicollect || config.epicollect;
};
