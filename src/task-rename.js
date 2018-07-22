/* eslint-disable no-console */

const { getAllFiles } = require("./walker.js");
const { renameTag } = require("./rename.js");

async function runTaskRename(args) {
  try {
    const { cuSort, tag } = args;
    const walkOutput = await getAllFiles(cuSort);
    //TODO: check if cuSort exists
    listReadFiles(walkOutput);
    console.log("\n About to rename files...");
    const renamedFiles = await renameTag(walkOutput, tag);
    renamedFiles.forEach(
      // item => console.log(item)
      item => console.log(item.oldName, " --> ", item.newName)
    );
    //TODO: implement rename module
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
