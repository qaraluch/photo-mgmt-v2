const path = require("path");
const R = require("ramda");

const { getExifData } = require("./exif.js");
const {
  parseExistedFileName,
  getDateFromMetadata,
  correctExifDate
} = require("./utils.js");

const getExt = fileName => path.parse(fileName).ext;
const getName = fileName => path.parse(fileName).name;

async function doRenameFiles(walkOutput) {
  const infoToRename = pullInfoFromWalk(walkOutput);
  const infoFromFileName = R.map(getInfoFromFileNameMapper, infoToRename);
  const infoWithExif = await getExifData(infoFromFileName);
  const xform = R.compose(
    R.map(transformExtToLowerCase),
    R.map(transformExtLongJpeg),
    R.map(addVersions),
    R.map(getMetaData),
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
      stats: item.stats,
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

function getInfoFromFileNameMapper(item) {
  const { oldBaseName } = item;
  const info = parseExistedFileName(oldBaseName);
  const itemChanged = { ...item, ...info };
  return itemChanged;
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
  item.version || (item.version = "0");
  return item;
}

function getMetaData(item) {
  const { date, newExt } = item;

  if (!date) {
    if (newExt === ".jpg") {
      item.date = getDateFromMetadata(
        item.exif.DateTimeOriginal &&
          correctExifDate(item.exif.DateTimeOriginal)
      );
    } else if (newExt === ".mp4") {
      item.date = getDateFromMetadata(
        item.exif.TrackCreateDate && correctExifDate(item.exif.TrackCreateDate)
      );
    } else if (newExt === ".png") {
      item.date = getDateFromMetadata(item.stats.ctime.toString());
    } else if (newExt === ".gif") {
      item.date = getDateFromMetadata(item.stats.ctime.toString());
    }
  }
  return item;
}

function reassemblyFileName(item) {
  const { oldName, date, version = "", comment, newExt } = item;
  const commentWithHyphen =
    typeof comment === "undefined"
      ? ""
      : typeof comment === "object"
        ? ""
        : ` - ${comment}`;
  if (date) {
    item.newName = `${date}-${version}${commentWithHyphen}${newExt}`;
  } else {
    item.newName = oldName;
  }
  return item;
}

module.exports = {
  doRenameFiles
};
