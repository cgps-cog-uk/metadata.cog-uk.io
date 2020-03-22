/* eslint "no-throw-literal": 0 */

const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "https://five.epicollect.net/api",
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});

const accessTokenCache = new Map();

async function createAccessToken(project, useCache = true) {
  if (useCache && accessTokenCache.has(project.id)) {
    return accessTokenCache.get(project.id);
  }
  else {
    const response = await axiosClient.request({
      method: "POST",
      url: "oauth/token",
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
      data: {
        grant_type: "client_credentials",
        client_id: project.client.id,
        client_secret: project.client.secret,
      },
    });
    accessTokenCache.set(project.id, response.data.access_token);
    return response.data.access_token;
  }
}

async function createAuthorizationHeader(project, useCache) {
  const token = await createAccessToken(project, useCache);
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function makeApiRequest(project, method, url, data) {
  try {
    const response = await axiosClient.request({
      headers: await createAuthorizationHeader(project),
      method,
      url,
      data,
    });
    return response;
  }
  catch (error) {
    if (error) {
      return axiosClient.request({
        headers: await createAuthorizationHeader(project, false /* do not use cache */),
        method,
        url,
        data,
      });
    }
    else {
      throw error;
    }
  }
}

module.exports.getProjectDefinition = async function (project) {
  const response = await makeApiRequest(project, "GET", `/export/project/${project.id}`);
  return response.data;
};

module.exports.createEntry = async function (project, data) {
  const response = await makeApiRequest(project, "POST", `/import/entries/${project.id}`, { data });
  return response.data;
};
