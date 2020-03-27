/* eslint "no-throw-literal": 0 */

const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "https://covid.majora.ironowl.it/api/v2/artifact",
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});

module.exports.createOrUpdateBiosamples = async function (username, token, biosamples) {
  const response = await axiosClient.request({
    method: "POST",
    url: "biosample/add/",
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
    url: "library/add/",
    data: {
      username,
      token,
      library,
    },
  });
}
module.exports.createOrUpdateSequencing = async function (username, token, sequencing) {
  const response = await axiosClient.request({
    method: "POST",
    url: "sequencing/add/",
    data: {
      username,
      token,
      sequencing,
    },
  });
}
