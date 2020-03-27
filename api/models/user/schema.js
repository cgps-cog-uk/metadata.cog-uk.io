module.exports = {
  createdAt: { type: Date },
  email: String,
  name: String,
  apiAccessToken: {
    type: String,
    index: true,
  },
};
