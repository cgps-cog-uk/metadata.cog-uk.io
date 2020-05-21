<template>
  <section>
    <nav>
      <template
        v-if="!uploading"
      >
        <button
          v-if="mode === 'data'"
          class="button--green"
          v-on:click="startUpload"
        >
          Start Upload to {{ /^test-/i.test($auth.user.username) ? "Test" : "Live" }} Server
        </button>
      </template>
      <upload-another-file-button
        v-if="mode === 'data'"
        class="button--grey"
      >
        Upload another file
      </upload-another-file-button>
    </nav>
    <files-uploader v-if="mode === 'files'" />
    <data-grid v-if="mode === 'data'" />
  </section>
</template>

<script>
import { mapState } from "vuex";

import FilesUploader from "~/components/FilesUploader.vue";
import DataGrid from "~/components/DataGrid.vue";
import UploadAnotherFileButton from "~/components/UploadAnotherFileButton";

export default {
  middleware: "auth",
  components: {
    DataGrid,
    FilesUploader,
    UploadAnotherFileButton,
  },
  data() {
    return {
      soundVolume: 0.001,
    };
  },
  computed: {
    ...mapState({
      data: "data",
      mode: "mode",
      uploading: "uploading",
    }),
  },
  beforeMount() {
    const url = 'wss://flavio-websockets-server-example.glitch.me'
    const connection = new WebSocket(url)

    connection.onopen = () => {
      connection.send('hey') 
    }

    connection.onerror = (error) => {
      console.log(`WebSocket error: ${error}`)
    }

    connection.onmessage = (e) => {
      console.log(e.data)
    }
  },
  methods: {
    startUpload() {
      this.$axios.$post("/api/data/submit/", {})
        .catch(() => {})
        .then(() => {
          setTimeout(() => this.startUpload(), 0);
        });
    },
  },
};
</script>

<style scoped>
nav {
  position: fixed;
  top: 32px;
  left: 8px;
  z-index: 1;
}

.toggle-volume {
  width: 50px;
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
