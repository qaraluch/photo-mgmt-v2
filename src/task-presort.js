const makeDir = require("make-dir");

const { getAllFiles } = require("./walker.js");
const { doRenameFiles } = require("./rename.js");

async function runTaskPresort(args) {
  try {
    const { cu, cuSort } = args;
    const walkOutput = await getAllFiles(cu);
    await makeDir(cuSort);
    listReadFiles(walkOutput);
    console.log("About to rename files...");
    const renamedFiles = doRenameFiles(walkOutput);
    renamedFiles.forEach(item => console.log(item[1], " --> ", item[2]));
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
