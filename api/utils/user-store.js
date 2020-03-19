/* eslint no-unused-vars: 0 */

const User = require("../models/user");

module.exports = {
  serialize(user, done) {
    done(null, user.id);
  },
  deserialize(id, done) {
    User.findById(id)
      .exec((err, user) => done(err, user));
  },
  save(profile, done) {
    User.findOne({ email: profile.id })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  },
};
