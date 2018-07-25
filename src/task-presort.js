/* eslint-disable no-console */
const makeDir = require("make-dir");

const { getAllFiles } = require("./walker.js");
const { doRenameFilesForPresort } = require("./rename.js");
const { moveFilesTo } = require("./move-files.js");

async function runTaskPresort(args) {
  try {
    const { cu, cuSort, dryRun } = args;
    const walkOutput = await getAllFiles(cu);
    await makeDir(cuSort);
    listReadFiles(walkOutput);
    console.log("\n About to rename files...");
    const renamedFiles = await doRenameFilesForPresort(walkOutput);
    console.log("\n Moving files ...");
    if (dryRun) {
      console.log("[!][ WARN ] Dry run mode. Not renaming files on disk. \n");
      renamedFiles.forEach(item =>
        console.log(item.oldName, " --> ", item.newName)
      );
    } else {
      await moveFilesTo(renamedFiles, cuSort);
    }
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

module.exports = runTaskPresort;
