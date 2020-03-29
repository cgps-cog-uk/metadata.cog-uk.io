/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

import formManifest from "../assets/form-manifest";
import measureTextWidth from "../assets/scripts/measure-text-width";

const statudToFilterMap = {
  Pending: "queued",
  Uploading: "queued",
  Uploaded: "uploaded",
  Failed: "failed",
  Duplicated: "duplicated",
};

export const state = () => ({
  data: {
    headers: undefined,
    entries: undefined,
  },
  filter: null,
  formManifest: null,
  mode: "files",
  uploading: false,
  user: null,
});

export const mutations = {
  reset(state) {
    state.mode = "files";
    state.uploading = false;
  },
  setEntryStatus(state, { entryId, status, error, messages }) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      entry.Status = status;
      if (messages) {
        entry._messages = messages;
      }
      if (error) {
        entry._error = error;
      }
    }
  },
  setFilter(state, filter) {
    if (state.filter === filter) {
      state.filter = null;
    }
    else {
      state.filter = filter;
    }
  },
  setData(state, data) {
    const entries = [];
    const headers = data[0].map((x) => (x.toLowerCase ? x.toLowerCase() : x));
    for (let index = 1; index < data.length; index++) {
      const row = data[index];
      const entry = {
        _id: index.toString(),
        Status: "Pending",
      };
      for (let column = 0; column < headers.length; column++) {
        entry[headers[column]] = row[column];
      }
      entries.push(entry);
    }
    state.data = {
      headers,
      entries,
    };
    state.mode = "data";
    state.filter = null;
  },
  setError(state, err) {
    state.mode = "error";
    state.errorMessage = err.response.data.error;
  },
  setMode(state, mode) {
    state.mode = mode;
  },
  setUploading(state, mode) {
    state.uploading = mode;
  },
};

export const getters = {
  allTypes() {
    return [
      {
        name: "barcode",
        default: "",
        hasEnum: true,
      },
      {
        name: "boolean",
        default: false,
        hasEnum: true,
      },
      {
        name: "datatable",
        default: null,
        hasEnum: false,
      },
      {
        name: "date",
        default: null,
        hasEnum: true,
      },
      {
        name: "datetime",
        default: null,
        hasEnum: false,
      },
      {
        name: "file",
        default: null,
        hasEnum: false,
      },
      {
        name: "graph",
        default: null,
        hasEnum: false,
      },
      {
        name: "integer",
        default: null,
        hasEnum: true,
      },
      {
        name: "list",
        default: [],
        hasEnum: false,
      },
      {
        name: "map",
        default: {},
        hasEnum: false,
      },
      {
        name: "number",
        default: 0,
        hasEnum: true,
      },
      {
        name: "regex",
        default: "",
        hasEnum: true,
      },
      {
        name: "text",
        default: "",
        hasEnum: true,
      },
      {
        name: "url",
        default: "",
        hasEnum: true,
      },
    ];
  },
  formInputs(state) {
    return formManifest;
  },
  filteredList(state) {
    if (state.filter) {
      return state.data.entries.filter((x) => statudToFilterMap[x.Status] === state.filter);
    }
    else {
      return state.data.entries;
    }
  },
  dataGridHeaders(state, getters) {
    const inputsByName = {};
    for (const input of getters.formInputs) {
      inputsByName[input.name] = input;
    }
    const headers = [
      {
        value: "Status",
        text: "Status",
        width: 88,
      },
    ];
    for (const header of state.data.headers) {
      const input = inputsByName[header];
      const text = input ? input.description : header;
      headers.push({
        value: header,
        text,
        width: measureTextWidth(text) + 36,
      });
    }
    return headers;
  },
  groups(state) {
    const queued = [];
    const uploaded = [];
    const failed = [];
    const duplicated = [];

    for (const row of state.data.entries) {
      switch (row.Status) {
        case "Pending":
        case "Uploading":
          queued.push(row);
          break;
        case "Uploaded":
          uploaded.push(row);
          break;
        case "Failed":
          failed.push(row);
          break;
        case "Duplicated":
          duplicated.push(row);
          break;
      }
    }

    return {
      queued,
      uploaded,
      failed,
      duplicated,
    };
  },
  typesByName(state, getters) {
    const dict = {};
    for (const item of getters.allTypes) {
      dict[item.name] = item;
    }
    return dict;
  },
};

export const actions = {
  uploadEntry({ commit, state }, entryId) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      commit("setUploading", true);
      commit("setEntryStatus", { entryId, status: "Uploading" });
      const request = {
        biosamples: [ entry ],
      };
      return (
        this.$axios.$post("/api/data/submit/", request)
          .then((response) => {
            const status = response.ok ? "Uploaded" : "Failed";
            commit(
              "setEntryStatus",
              {
                entryId,
                status,
                error: (
                  response.ok
                    ?
                    null
                    :
                    `Errors in the following fields: ${Object.keys(response.messages[0]).join(", ")}`
                ),
                messages: response.messages[0],
              }
            );
          })
          .catch((err) => {
            console.error(err);
            commit(
              "setEntryStatus",
              {
                entryId,
                status: "Failed",
                error: err.response ? err.response.data.error : err,
              }
            );
          })
      );
    }
    return Promise.resolve();
  },
  signout({ commit }, payload) {
    commit("setCredentials", {});
  },
};
