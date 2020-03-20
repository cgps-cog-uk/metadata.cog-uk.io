const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

schema.pre("save", require("./pre-save"));

schema.statics.findByAccessToken = require("./find-by-access-token");

module.exports = mongoose.model("User", schema);
