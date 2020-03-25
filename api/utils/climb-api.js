/* eslint "no-throw-literal": 0 */

const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "https://covid.majora.ironowl.it/api/v2/artifact",
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});

module.exports.createBiosamples = async function (username, token, biosamples) {
  const response = axiosClient.request({
    method: "POST",
    url: "biosample/add",
    data: {
      username,
      token,
      biosamples,
    },
  });
  return response.data;
};
