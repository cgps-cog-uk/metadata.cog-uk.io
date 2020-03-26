const formManifest = require("../../../assets/form-manifest");

async function generateTemplate(req, res) {
  const csvHeader = (
    formManifest
      .map((x) => `"${x.name}"`)
      .join(",")
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=cog-uk-metadata-template.csv"
  );
  res.setHeader(
    "Content-Type",
    "text/csv; charset=utf-8"
  );
  res.send(csvHeader);
}

module.exports = function (req, res, next) {
  console.info("Got request to download template");

  Promise.resolve()
    .then(() => generateTemplate(req, res))
    .catch(next);
};
