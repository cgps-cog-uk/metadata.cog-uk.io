/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

const formManifest = require("../assets/form-manifest");

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
  setEntryStatus(state, { entryId, status, error }) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      entry._status = status;
      if (error) {
        entry._error = error;
        if (error.message === "Field is not unique.") {
          entry._status = "Duplicated";
        }
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
        _status: "Pending",
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
  setUser(state, user) {
    state.user = {
      name: user.name,
      email: user.email,
      apiAccessToken: user.apiAccessToken,
    };
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
      return state.data.entries.filter((x) => statudToFilterMap[x._status] === state.filter);
    }
    else {
      return state.data.entries;
    }
  },
  isAnonymous(state) {
    return !state.user;
  },
  isAuthenticated(state) {
    return !!state.user;
  },
  groups(state) {
    const queued = [];
    const uploaded = [];
    const failed = [];
    const duplicated = [];

    for (const row of state.data.entries) {
      switch (row._status) {
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
  async nuxtServerInit({ commit }, { req }) {
    if (req.user) {
      commit(
        "setUser",
        req.user
      );
    }
  },
  uploadEntry({ commit, state }, entryId) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      commit("setUploading", true);
      commit("setEntryStatus", { entryId, status: "Uploading" });
      return (
        this.$axios.$post("/api/data/create/", entry)
          .then(() => commit("setEntryStatus", { entryId, status: "Uploaded" }))
          .catch((err) => commit("setEntryStatus", { entryId, status: "Failed", error: err.response.data.error }))
      );
    }
    return Promise.resolve();
  },
};
