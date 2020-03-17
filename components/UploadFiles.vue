<template>
  <section>
    <div>
      <div
        ref="drop-target"
        class="upload-files"
      >
        <svg class="w-10 h-10 link-blue" viewBox="0 0 24 24">
          <g fill="currentColor" fill-rule="evenodd">
            <path fill-rule="nonzero" d="M12 22.667c5.891 0 10.667-4.776 10.667-10.667S17.89 1.333 12 1.333 1.333 6.11 1.333 12 6.11 22.667 12 22.667zM12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z"></path>
            <path d="M11.143 6v5.143H6v1.714h5.143V18h1.714v-5.143H18v-1.714h-5.143V6z"></path>
          </g>
        </svg>
        <div class="label-1">Drag and drop files</div>
        <div class="label-2">or click to send up to 64GB</div>
        <input
          id="file-upload"
          ref="file-input"
          type="file"
          multiple="multiple"
          v-on:change="handleFileChange"
        >
        <label
          role="button"
          title="Select files to upload"
          for="file-upload"
        >
          Select files to upload
        </label>
        <p>{{ message }}</p>
      </div>
    </div>
    <div>
      <div class="into">
        <h2>
          COVID-19 Sequencing Metadata Upload
        </h2>
        <p>
          For small numbers of samples, you can upload your data through using EpiCollect.  You can upload batches of data as a CSV file by dragging and dropping the data below or clicking “Upload Metadata”
        </p>
        <p>
          You can create a CSV file in Excel, Google Docs or other spreadsheet software.  Please use this template; do not edit, add, or remove any columns.  Make sure you save it as a CSV (or Comma Separated Variable) file.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
// import dropSheet from "../assets/scripts/dropsheet";
import readFile from "../assets/scripts/read-file";

const validFiles = /(\.xlsx|\.xls|\.csv|\.ods)$/i;

export default {
  data() {
    return {
      message: "",
    };
  },
  mounted() {
    // dropSheet({
    //   file: this.$refs["file-input"],
    //   drop: this.$refs["drop-target"],
    //   on: {
    //     workstart: () => this.setInfoMessage("Processing file..."),
    //     workend: () => this.setInfoMessage("Done."),
    //     sheet: (json, sheetnames, cb) => {
    //       console.log({ json, sheetnames, cb });
    //     },
    //   },
    //   errors: {
    //     badfile: () => this.setInfoMessage("Bad file"),
    //     pending: () => this.setInfoMessage("Pending"),
    //     failed: () => this.setInfoMessage("Failed"),
    //     large: () => this.setInfoMessage("Large file"),
    //   },
    // });
  },
  methods: {
    handleFileChange(event) {
      // console.log(Array.from(event.target.files));
      this.processFile(event.target.files[0]);
    },
    processFile(file) {
      if (validFiles.test(file.name)) {
        this.message = `Processing file ${file.name}`;
        readFile(
          file,
          (err, data) => {
            if (err) {
              this.setInfoMessage(err);
            }
            else {
              this.$store.commit("setData", data);
            }
          }
        );
      }
      else {
        this.setInfoMessage("Invalid file type. Supported files are: .xslx, .xsl, .csv, or .ods");
      }
    },
    setInfoMessage(message) {
      this.message = message;
    },
  },
};
</script>

<style scoped>
.upload-files {
  width: 100%;
  padding: 64px 24px;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  border-width: 2px;
  border-style: dashed;
  border-radius: .25rem;
  border-color: rgba(21,20,26,.2);
}

svg {
  color: #0060df;
  width: 24px;
  height: 24px;
}

input {
  width: 0;
  position: absolute;
  overflow: hidden;
  opacity: 0;
  height: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.label-1 {
  font-weight: 700;
  padding-bottom: 8px;
  padding-top: 24px;
  text-align: center;
  font-size: 18px;
  letter-spacing: .05em;
}

.label-2 {
  font-size: 16px;
  text-align: center;
  padding-bottom: 24px;
}

label {
  background-color:#0060df;
  color:#fff;
  cursor: pointer;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 16px;
}

</style>
