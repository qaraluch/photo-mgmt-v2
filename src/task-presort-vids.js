const path = require("path");
const makeDir = require("make-dir");

const { getTimeStamp } = require("./utils.js");
const { getAllFiles } = require("./walker.js");

async function runTaskPresortVids(args) {
  try {
    const { cu, cuBackup } = args;
    const walkOutput = await getAllFiles(cu);
    await makeDir(cuBackup);
    listReadFiles(walkOutput);
    // const toBackupFilesPaths = copyPathsForBackup(walkOutput);
    console.log("About to ...");
    return;
  } catch (error) {
    console.error(error);
  }
}

function listReadFiles(walkOutput) {
  console.log("Read files:");
  listFiles(walkOutput);
}

function listFiles(walkOutput) {
  walkOutput.forEach(item => {
    console.log("-->", item.name);
  });
}

// function copyPathsForBackup(walkOutput) {
//   const copyPaths = [...walkOutput.map(item => item.path)];
//   return copyPaths;
// }

// function constructBackupFileName() {
//   const fileName = `cu-temp-arch-${getTimeStamp()}.zip`;
//   return fileName;
// }

module.exports = runTaskPresortVids;
