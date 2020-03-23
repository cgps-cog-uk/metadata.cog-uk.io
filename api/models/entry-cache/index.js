const mongoose = require("mongoose");

const schema = mongoose.Schema(require("./schema"));

schema.pre("save", require("./pre-save"));

schema.statics.findOneOrCreate = require("./findOneOrCreate");

module.exports = mongoose.model("EntryCache", schema);
