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

async function doRenameFiles(walkOutput) {
  const copyInfoToRename = pullInfoFromWalk(walkOutput);
  const xform = R.compose(
    R.map(transformExtToLowerCase),
    R.map(transformExtLongJpeg),
    R.map(readPreexistedData),
    R.map(addVersions)
  );
  const processedTransducer = R.into([], xform);
  const renamedFiles = processedTransducer(copyInfoToRename);
  const withExifData = await getExifData(renamedFiles);
  withExifData.forEach(item => {
    console.log(item.oldName, " --> ", item.exif.data[0].Model);
  });
  const result = R.map(reassemblyFileName, renamedFiles);
  return result;
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
  return item;
}

//Exif:

const exiftool = require("node-exiftool");
const exiftoolBin = require("dist-exiftool");
//[Sobesednik/node-exiftool: A Node.js interface to exiftool command-line application.](https://github.com/Sobesednik/node-exiftool)

const throat = require("throat");
//[ForbesLindesay/throat: Throttle a collection of promise returning functions](https://github.com/ForbesLindesay/throat)

async function getExifData(walkOutput) {
  const ep = new exiftool.ExiftoolProcess(exiftoolBin);
  await ep.open();
  async function runCheck(item) {
    try {
      item.exif = await ep.readMetadata(item.path, ["-File:all"]);
      return item;
    } catch (error) {
      throw error;
    }
  }
  const promises = walkOutput.map(throat(8, runCheck, Promise.resolve()));
  const newWalkOutput = await Promise.all(promises);
  await ep.close();
  return newWalkOutput;
}

module.exports = {
  doRenameFiles
};
