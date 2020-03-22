const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

schema.pre("save", require("./pre-save"));

schema.statics.findByAccessToken = require("./find-by-access-token");

schema.methods.getProject = require("./get-project");

module.exports = mongoose.model("User", schema);
