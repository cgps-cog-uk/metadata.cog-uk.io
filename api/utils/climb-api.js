/* eslint "no-throw-literal": 0 */

const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "https://covid.majora.ironowl.it/",
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});

module.exports.createOrUpdateBiosamples = async function (username, token, biosamples) {
  const response = await axiosClient.request({
    method: "POST",
    url: "api/v2/artifact/biosample/add/",
    data: {
      username,
      token,
      biosamples,
    },
  });
  return response.data;
};

module.exports.createOrUpdateLibrary = async function (username, token, library) {
  const response = await axiosClient.request({
    method: "POST",
    url: "api/v2/artifact/library/add/",
    data: {
      username,
      token,
      ...library[0],
      biosamples: library,
    },
  });
  return response.data;
};

module.exports.createOrUpdateSequencing = async function (username, token, sequencing) {
  const response = await axiosClient.request({
    method: "POST",
    url: "api/v2/process/sequencing/add/",
    data: {
      username,
      token,
      ...sequencing[0],
      runs: sequencing,
    },
  });
  return response.data;
};

module.exports.authenticate = function (username, token) {
  return (
    module.exports.createOrUpdateBiosamples(username, token, [{}])
      .then(() => true)
      .catch(() => false)
  );
};
