const path = require("path");
const R = require("ramda");

function pullInfoFromWalk(walkOutput) {
  const copyInfo = [...walkOutput.map(item => [item.path, item.name])];
  return copyInfo;
}

const getExt = fileName => path.parse(fileName).ext;
const getName = fileName => path.parse(fileName).name;

function transformExtToLowerCase(item) {
  const oldName = item[1];
  const nameExt = getExt(oldName).toLowerCase();
  const nameBase = getName(oldName);
  const newItem = [...item, `${nameBase}${nameExt}`];
  return newItem;
}

function transformExtLongJpeg(item) {
  const oldName = item.pop();
  const oldExt = getExt(oldName);
  const nameExt = oldExt === ".jpeg" ? ".jpg" : oldExt;
  const nameBase = getName(oldName);
  const newItem = [...item, `${nameBase}${nameExt}`];
  return newItem;
}

function doRenameFiles(walkOutput) {
  const copyInfoToRename = pullInfoFromWalk(walkOutput);
  const xform = R.compose(
    R.map(transformExtToLowerCase),
    R.map(transformExtLongJpeg)
  );
  const processedTransducer = R.into([], xform);
  const result = processedTransducer(copyInfoToRename);
  return result;
}

module.exports = {
  doRenameFiles
};
