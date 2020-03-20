<template>
  <div class="full-container">
    <header>
      <h1>
        COG-UK
      </h1>
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
        <a
          href="https://cutt.ly/cog-uk-epicollect-docs"
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
        Logged in as {{ user.email }}.
      </span>
      <ul>
        <li>
          <a href="mailto:support@cog-uk.io">support@cog-uk.io</a>
        </li>
        <li>
          <a href="/api">
            API
          </a>
        </li>
        <li>
          <a href="/logout">
            Logout
          </a>
        </li>
      </ul>
    </footer>
  </div>
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
      user: "user",
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
.full-container {
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
  min-height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  display: flex;
  position: relative;
  max-width: 64rem;
  /* height: 100%; */
  flex-grow: 1;

  /* flex: 1 1 0%; */
  align-self: center;
  align-items: center;
  margin: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  /* min-height: 20rem; */
  /* max-height: 36rem; */
  /* width: calc(100% - 3rem); */
  -moz-box-flex: 0;

  overflow: auto;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
  background: transparent;
  line-height: 20px;
  cursor: pointer;
  font-size: 16px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
  background: transparent;
  line-height: 20px;
  cursor: pointer;
  font-size: 16px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

footer {
  width: 100%;
  padding: 8px 32px;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: .75rem;
  color: #4a4a4f;
  align-items: center;
  font-weight: 500;
}
footer ul {
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  display: flex;
  user-select: none;
  list-style: none;
  margin: 0;
  padding: 0;
}
footer ul li {
  margin: .5rem;
}
footer ul li a {
  color: inherit;
  text-decoration: none;
  background-color: initial;
}
</style>
