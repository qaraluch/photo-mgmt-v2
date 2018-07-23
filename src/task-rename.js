/* eslint-disable no-console */

const { getAllFiles } = require("./walker.js");
const { addTag } = require("./rename.js");
const { renameFiles } = require("./rename-files.js");

async function runTaskRename(args) {
  try {
    const { cuSort, tag, renameAfterParentDir } = args;
    const walkOutput = await getAllFiles(cuSort);
    //TODO: check if cuSort exists
    listReadFiles(walkOutput);
    console.log("\n About to rename files...");
    const renamedFiles = addTag(walkOutput, tag, renameAfterParentDir);
    //TODOC: tag is ignored when renameAfterParentDir is passed as true
    await renameFiles(renamedFiles);
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

module.exports = runTaskRename;
