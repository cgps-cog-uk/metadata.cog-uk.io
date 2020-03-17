/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

export const state = () => ({
  mode: "files",
  data: {
    headers: undefined,
    entries: undefined,
  },
  errorMessage: undefined,
});

export const mutations = {
  setEntryStatus(state, { entryId, status, error }) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      entry._status = status;
      if (error) {
        entry._error = error;
      }
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
};

export const getters = {
};

export const actions = {
  uploadEntry({ commit, state }, entryId) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
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
