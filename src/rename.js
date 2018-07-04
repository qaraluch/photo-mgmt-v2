const path = require("path");
const R = require("ramda");

const { getExifData } = require("./exif.js");

const getExt = fileName => path.parse(fileName).ext;
const getName = fileName => path.parse(fileName).name;

async function doRenameFiles(walkOutput) {
  const infoToRename = pullInfoFromWalk(walkOutput);
  const infoFromFileName = R.map(readPreexistedData, infoToRename);
  const infoWithExif = await getExifData(infoFromFileName);
  const xform = R.compose(
    R.map(transformExtToLowerCase),
    R.map(transformExtLongJpeg),
    R.map(addVersions),
    R.map(reassemblyFileName)
  );
  const transducer = R.into([], xform);
  const renamedFiles = transducer(infoWithExif);
  return renamedFiles;
}

function pullInfoFromWalk(walkOutput) {
  const copyInfo = [
    ...walkOutput.map(item => ({
      path: item.path,
      oldName: item.name,
      oldBaseName: getName(item.name),
      newExt: getExt(item.name),
      date: undefined,
      version: undefined,
      tag: undefined,
      comment: undefined,
      prefix: undefined,
      suffix: undefined
    }))
  ];
  return copyInfo;
}

//ES9 / node.js ^10.3.0
const regexDate = /(?<date>\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2})(-)?(?<version>\d)?(\s)?([-|—])?(\s)?(?<comment>.+)?/;

function readPreexistedData(item) {
  const { oldBaseName } = item;
  const match = regexDate.exec(oldBaseName);
  item.date = match && match.groups.date;
  item.version = match && match.groups.version;
  item.comment = match && match.groups.comment;
  item.comment && (item.comment = item.comment.trim());
  return item;
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

function addVersions(item) {
  item.date && !item.version && (item.version = 0);
  return item;
}

function reassemblyFileName(item) {
  const { oldName, date, version = "", comment, newExt } = item;
  const commentWithHyphen =
    typeof comment === "undefined" ? "" : ` - ${comment}`;
  if (date) {
    item.newName = `${date}-${version}${commentWithHyphen}${newExt}`;
  } else {
    item.newName = oldName;
  }
  // console.log("item ", item.newName);
  return item;
}

module.exports = {
  doRenameFiles
};
