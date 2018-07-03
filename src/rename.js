const path = require("path");
const R = require("ramda");

const getExt = fileName => path.parse(fileName).ext;
const getName = fileName => path.parse(fileName).name;

function pullInfoFromWalk(walkOutput) {
  const copyInfo = [
    ...walkOutput.map(item => ({
      path: item.path,
      oldName: item.name,
      oldBaseName: getName(item.name),
      newExt: getExt(item.name)
    }))
  ];
  return copyInfo;
}

function transformExtToLowerCase(item) {
  item.newExt = item.newExt.toLowerCase();
  return item;
}

function transformExtLongJpeg(item) {
  const oldExt = item.newExt;
  const newExt = oldExt === ".jpeg" ? ".jpg" : oldExt;
  item.newExt = newExt;
  return item;
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
