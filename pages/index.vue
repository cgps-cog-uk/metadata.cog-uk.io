<template>
  <section>
    <nav>
      <template>
        <button
          class="toggle-volume"
          v-on:click="toggleVolume"
        >
          &nbsp;
        </button>
      </template>
      <template
        v-if="!uploading"
      >
        <button
          v-if="mode === 'data' & server === 'production'"
          class="button--green"
          v-on:click="startUploadClicked"
        >
          Start Upload to Production Server
        </button>
        <button
          v-if="mode === 'data' & server === 'test'"
          class="button--red"
          v-on:click="startUploadClicked"
        >
          Start Upload to Test Server
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
import { Howl } from "howler";

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
      auth: "auth",
      data: "data",
      mode: "mode",
      uploading: "uploading",
    }),
    server() {
      return this.auth.strategy === "majoraProduction" ? "production" : "test";
    },
  },
  mounted() {
    this.sound = new Howl({
      src: "/sounds/adventures_of_flying_jack.mp3",
      autoplay: false,
      loop: true,
      volume: this.soundVolume,
      onend() {
        console.log("Sound Track Finished!");
      },
    });
  },
  methods: {
    setFilter(filter) {
      this.$store.commit("setFilter", filter);
    },
    startUploadClicked() {
      this.sound.play();
      this.startUpload();
    },
    startUpload() {
      const entry = this.data.entries.find((x) => x.Status === "Pending");
      if (entry) {
        this.$store.dispatch("uploadEntry", entry._id)
          .catch((error) => console.error(error))
          .then(() => {
            setTimeout(() => this.startUpload(), 0);
          });
      } else {
        console.log("Done");
        this.sound.stop();
      }
    },
    toggleVolume() {
      if (this.soundVolume === 0.001) {
        this.soundVolume = 0.5;
      } else {
        this.soundVolume = 0.001;
      }
      this.sound.volume(this.soundVolume);
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
