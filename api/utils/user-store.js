/* eslint no-unused-vars: 0 */
const uuid = require("uuid-random");
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
    User.findOneOrCreate(
      { email: profile.id },
      {
        email: profile.id,
        apiAccessToken: uuid().replace(/-/g, ""),
      }
    )
      .then((user) => done(null, user))
      .catch((err) => done(err));
  },
};
