const { StatusCodeError } = require("../errors");

module.exports = function (req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    throw new StatusCodeError(401); // Unauthorized: User must be authenticated
  }

  next();
};
