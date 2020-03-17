<template>
  <div class="container">
    <header>
      <h1>
        COG-UK
      </h1>
      <nav>
        <button
          v-if="mode === 'data'"
          class="button--green"
          v-on:click="startUpload"
        >
          Start Upload
        </button>
        <button
          v-if="mode === 'data'"
          class="button--grey"
          v-on:click="resetToFileMode"
        >
          Upload another file
        </button>
        <a
          href="https://docs.google.com/document/d/1Ziqy71O6cZ70KR6o-yhfgQmrYx9-qZBkVzEJ0C0YIDY"
          target="_blank"
          class="button--grey"
        >
          Help
        </a>
      </nav>
    </header>
    <main>
      <upload-files v-if="mode === 'files'" />
      <data-grid v-if="mode === 'data'" />
    </main>
    <footer>
      <span>
        <!-- Developed by The Centre for Genomic Pathogen Surveillance (CGPS) -->
      </span>
      <span>
        <a href="mailto:support@cog-uk.io">support@cog-uk.io</a>
      </span>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";

import UploadFiles from "~/components/UploadFiles.vue";
import DataGrid from "~/components/DataGrid.vue";

export default {
  components: {
    DataGrid,
    UploadFiles,
  },
  computed: {
    ...mapState({
      data: "data",
      mode: "mode",
    }),
  },
  methods: {
    resetToFileMode() {
      this.$store.commit("setMode", "files");
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

<style>
body {
  font-family: Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,Oxygen,Fira Sans,Droid Sans,Helvetica Neue;
  background-color: #f9f9fa;
  background-image: url(/icon-white.svg);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  overflow-x: hidden;
  height: 100vh;
}

header {
  width: 100%;
  height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  display: flex;
  position: relative;
  max-width: 64rem;
  height: 100%;

  flex: 1 1 0%;
  align-self: center;
  align-items: center;
  margin: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  min-height: 20rem;
  max-height: 36rem;
  width: calc(100% - 3rem);
  -moz-box-flex: 0;
}

footer {
  width: 100%;
  padding: 16px 32px;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

main > section {
  background-color: #fff;
  box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
  padding: 32px;
  flex-direction: row;
  display: flex;
  border-radius: 16px;
  width: 100%;
  overflow: hidden;
  /* min-height: 100%; */
  height: 100%;
  border: 0 solid #d7d7db;
  /* min-height: 32rem; */
  /* max-height: 38rem; */
}

main > section > div {
  width: 50%;
}

.into {
  padding: 0 24px;
  text-align: left;
}

.into h2 {
  font-size: 32px;
  padding-bottom: 8px;
  font-weight: 700;
}

.into p {
  line-height: 1.75;
  margin-top: 16px;
}
</style>
