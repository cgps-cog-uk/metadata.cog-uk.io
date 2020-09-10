const fs = require("fs");
const path = require("path");
const mergeOptions = require("merge-options");

let config = require("../defaults.json");

console.log(config);
if (fs.existsSync(path.resolve(__dirname, "..", "config.json"))) {
  console.log("Merging");
  config = mergeOptions(config, require("../config.json"));
}
console.log(config);

module.exports = config;
