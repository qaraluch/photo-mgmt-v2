const path = require("path");
const R = require("ramda");

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

module.exports = {
  doRenameFiles
};
