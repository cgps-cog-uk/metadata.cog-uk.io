<template>
  <section>
    <nav>
      <template
        v-if="uploading"
      >
        <button
          class="button--green"
          v-on:click="setFilter('queued')"
        >
          Queued ({{ groups.queued.length }})
        </button>
        <button
          class="button--green"
          v-on:click="setFilter('uploaded')"
        >
          Uploaded ({{ groups.uploaded.length }})
        </button>
        <button
          class="button--green"
          v-on:click="setFilter('failed')"
        >
          Failed ({{ groups.failed.length }})
        </button>
        <button
          class="button--green"
          v-on:click="setFilter('duplicated')"
        >
          Duplicates ({{ groups.duplicated.length }})
        </button>
      </template>
      <template
        v-else
      >
        <button
          v-if="mode === 'data'"
          class="button--green"
          v-on:click="startUpload"
        >
          Start Upload
        </button>
      </template>
      <button
        v-if="mode === 'data'"
        class="button--grey"
        v-on:click="resetToFileMode"
      >
        Upload another file
      </button>
    </nav>
    <upload-files v-if="mode === 'files'" />
    <data-grid v-if="mode === 'data'" />
  </section>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import UploadFiles from "~/components/UploadFiles.vue";
import DataGrid from "~/components/DataGrid.vue";

export default {
  middleware: "authenticated",
  components: {
    DataGrid,
    UploadFiles,
  },
  computed: {
    ...mapState({
      data: "data",
      mode: "mode",
      uploading: "uploading",
    }),
    ...mapGetters({
      groups: "groups",
    }),
  },
  methods: {
    resetToFileMode() {
      this.$store.commit("reset");
    },
    setFilter(filter) {
      this.$store.commit("setFilter", filter);
    },
    startUpload() {
      const entry = this.data.entries.find((x) => x._status === "Pending");
      if (entry) {
        this.$store.dispatch("uploadEntry", entry._id)
          .catch(() => {})
          .then(() => {
            setTimeout(() => this.startUpload(), 0);
          });
      }
    },
  },
};
</script>

<style scoped>
nav {
  position: fixed;
  top: 32px;
  left: 8px;
}
@media (max-width:768px) {
  nav button {
    padding: 0 1px;
    margin: 0;
    border: 0;
  }
}
@media (min-width:768px) {
  nav {
    position: fixed;
    top: 11px;
    right: 96px;
    left: unset;
  }
}
</style>
