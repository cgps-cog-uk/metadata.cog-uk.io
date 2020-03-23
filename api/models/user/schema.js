module.exports = {
  createdAt: { type: Date },
  email: String,
  name: String,
  apiAccessToken: {
    type: String,
    index: true,
  },
  project: {
    id: String,
    client: {
      id: String,
      secret: String,
    },
    uniqueIdField: String,
  },
};
