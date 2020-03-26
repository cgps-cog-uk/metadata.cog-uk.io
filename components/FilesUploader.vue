<template>
  <div class="columns">
    <div>
      <drop-zone v-if="hasCredentials" />
      <credentials-manager v-else />
    </div>
    <div>
      <div class="into">
        <h2>
          COVID-19 Sample Metadata Upload
        </h2>
        <p>
          You can upload batches of data using a spreadsheet by dragging and dropping the files or clicking “Select files to upload”.
        </p>
        <p>
          You can create a spreadsheet file in Excel, Google Docs or other spreadsheet software.
          Please use <a href="/api/downloads/template" target="_blank">this template</a>; do not edit, add, or remove any columns. This page supports CSV, Excel, ODF formats.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import CredentialsManager from "./CredentialsManager.vue";
import DropZone from "./DropZone.vue";

export default {
  components: {
    CredentialsManager,
    DropZone,
  },
  computed: {
    ...mapGetters({
      hasCredentials: "hasCredentials",
    }),
  },
};
</script>

<style scoped>
.columns {
  display: flex;
  flex-direction: column;
}

.into {
  padding: 0 24px;
  text-align: left;
}

.into h2 {
  font-size: 24px;
  padding-bottom: 8px;
  font-weight: 700;
}

.into p {
  line-height: 1.75;
  margin-top: 16px;
}

@media (min-width:768px) {
  .columns {
    flex-direction: row;
  }
  .columns > div {
    width: 50%;
  }
}
</style>
