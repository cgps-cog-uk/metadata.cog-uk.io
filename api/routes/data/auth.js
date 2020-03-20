const { StatusCodeError } = require("../../errors");

module.exports = function (req) {
  const hasValidAccessToken = (req.headers["access-token"] || req.query.accesstoken) === config.accessToken;
  if (!hasValidAccessToken) {
    if (!req.isAuthenticated() || !req.user) {
      throw new StatusCodeError(401); // Unauthorized: User must be authenticated
    }

    // A project can be accessed by the user who created it
    if (model.createdBy.toString() !== req.user.id) {
      throw new StatusCodeError(403); // Forbidden
    }
  }
};
