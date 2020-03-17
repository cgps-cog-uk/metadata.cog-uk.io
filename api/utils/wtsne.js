/* eslint no-param-reassign: 0 */

const exec = require("child_process").exec;
const tmp = require("tmp");
const es = require("event-stream");
const fs = require("fs");

const config = require("./config");

function runWtsneCpu(
  bBinaryInput = 0, // whether to use binary input format
  fnameP, // file for input similarity
  fnameY, // file for output coordinates
  fnameWeights = "none", // file for weights of data points. use none for uniform weights
  fnameY0 = "none", // file for initial coordinates, use none for random initialization
  maxIter = 1000000, // number of interations
  eta0 = 1, // initial learning rate
  nRepuSamp = 1, // number of repulsive samples
  workerCount = 16, // number of parallel workers
  bInit = 0 // whether to use initialization
) {
  return new Promise((resolve, reject) => {
    const args = [
      config.bin.wtsne,
      bBinaryInput,
      fnameP,
      fnameY,
      fnameWeights,
      fnameY0,
      maxIter,
      eta0,
      nRepuSamp,
      workerCount,
      bInit,
    ];
    const command = args.map((x) => `"${x}"`).join(" ");
    exec(
      command,
      (err, stdout, stderr) => {
        if (err) {
          stderr = null;
          reject(err, stderr);
        }
        else {
          stderr = null;
          console.log(stdout);
          resolve(stdout);
        }
      }
    );
  });
}

function collectOutputCoordinates(outputFile) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(outputFile)
      .pipe(es.split())
      .on("error", reject)
      .on("data", (line) => {
        if (line) {
          rows.push(line.split(" "));
        }
      })
      .on("end", () => {
        resolve(rows);
      });
  });
}

module.exports = function (inputFilePath) {
  return new Promise((resolve, reject) => {
    tmp.file((err, path, fd, cleanupCallback) => {
      if (err) {
        reject(err);
      }
      else {
        return (
          runWtsneCpu(0, inputFilePath, path)
            .then(() => {
              const rows = collectOutputCoordinates(path);
              cleanupCallback();
              resolve(rows);
            })
            .catch(reject)
        );
      }
    });
  });
}
