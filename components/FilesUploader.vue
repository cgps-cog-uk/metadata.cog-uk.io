<template>
  <div class="columns">
    <div>
      <drop-zone />
    </div>
    <div>
      <div class="into">
        <h2>
          COG-UK Sample Metadata Uploader
        </h2>
        <p>
          Upload batches of data using a spreadsheet by dragging and dropping the files or clicking “Select files to upload”.
        </p>
        <p>
          <br>Please use <a href="/api/downloads/template/biosamples" target="_blank">this template</a> for uploading biosamples only
          <br>or <a href="/api/downloads/template/all" target="_blank">this template</a> for uploading biosamples with library and sequencing metadata
          <br><br><strong>Do not</strong> edit, add, or remove any columns
          <br>The order of the columns, however, <strong>can</strong> be changed
          <br><br>This page supports CSV, Excel, ODF formats.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import DropZone from "./DropZone.vue";

export default {
  components: {
    DropZone,
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
