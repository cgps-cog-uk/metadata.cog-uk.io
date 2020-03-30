import readFile from "~/assets/scripts/read-file";
var processFile = function (file, store) {
    const validFiles = /(\.xlsx|\.xls|\.csv|\.ods)$/i;

    if (validFiles.test(file.name)) {
    //   this.message = `Processing file ${file.name}`;
      readFile(
        file,
        (err, data) => {
          if (err) {
            // this.setInfoMessage(err
          }
          else {
            const fields = [];
            for (const field of data[0]) {
              if (fields.includes(field)) {
                // this.setInfoMessage(`Duplicate field: ${field}`);
                return;
              }
              else {
                fields.push(field);
              }
            }
            return(data)
          }
        }
      );
    }
    else {
    //   this.setInfoMessage("Invalid file type. Supported files are: .xlsx, .xls, .csv, or .ods");
    }
}
export default processFile