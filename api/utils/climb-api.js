/* eslint "no-throw-literal": 0 */

const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "https://covid.majora.ironowl.it/api/v2/artifact",
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});

module.exports.createBiosamples = async function (username, token, biosamples) {
  const response = await axiosClient.request({
    method: "POST",
    url: "biosample/add/",
    data: {
      username,
      token,
      biosamples,
    },
  });
  // const results = response.data;
  // if (results.errors > 0) {
  //   // const errors = [];
  //   // for (const field of Object.keys(results.messages[0])) {
  //   //   for (const message of results.messages[0][field]) {
  //   //     errors.push({
  //   //       field,
  //   //       message: message.message,
  //   //     });
  //   //   }
  //   // }
  //   throw results.messages[0];
  // }
  return response.data;
};
