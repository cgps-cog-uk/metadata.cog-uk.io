/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

const statudToFilterMap = {
  Pending: "queued",
  Uploading: "queued",
  Uploaded: "uploaded",
  Failed: "failed",
  Duplidated: "duplicated",
};

export const state = () => ({
  mode: "files",
  data: {
    headers: undefined,
    entries: undefined,
  },
  uploading: false,
  filter: null,
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
  filteredList(state) {
    if (state.filter) {
      return state.data.entries.filter((x) => statudToFilterMap[x._status] === state.filter);
    }
    else {
      return state.data.entries;
    }
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
};

export const actions = {
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
