const path = require("path");
const makeDir = require("make-dir");
const R = require("ramda");

const { getTimeStamp } = require("./utils.js");
const { getAllFiles } = require("./walker.js");

async function runTaskPresortVids(args) {
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

//TODO: move to: rename.js
function pullInfoFromWalk(walkOutput) {
  const copyInfo = [...walkOutput.map(item => [item.path, item.name])];
  return copyInfo;
}

function transformExtToLowerCase(item) {
  const oldName = item[1];
  const nameExt = path.parse(oldName).ext.toLowerCase();
  const nameBase = path.parse(oldName).name;
  const newItem = [...item, `${nameBase}${nameExt}`];
  return newItem;
}

function doRenameFiles(walkOutput) {
  const copyInfoToRename = pullInfoFromWalk(walkOutput);
  const xform = R.compose(R.map(transformExtToLowerCase));
  const processedTransducer = R.into([], xform);
  const result = processedTransducer(copyInfoToRename);
  return result;
}

module.exports = runTaskPresortVids;
