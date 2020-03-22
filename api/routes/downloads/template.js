const epicollectApi = require("../../utils/epicollect");

async function generateTemplate(req, res) {
  const project = req.user.getProject();
  const projectDefinition = await epicollectApi.getProjectDefinition(project);
  const formManifest = projectDefinition.data.project.forms[0].inputs;
  const csvHeader = (
    formManifest
      .map((x) => `"${x.question.toLowerCase()}"`)
      .join(",")
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${project.id}-metadata-template.csv`
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
