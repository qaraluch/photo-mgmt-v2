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

async function doRenameFilesForPresort(walkOutput) {
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
  const infoRenamedWithDups = transducer(infoWithExif);
  const renamedFiles = bumpVersionOfDups(infoRenamedWithDups);
  return renamedFiles;
}

function pullInfoFromWalk(walkOutput) {
  const copyInfo = [
    ...walkOutput.map(item => ({
      path: item.path,
      stats: item.stats,
      oldName: item.name,
      parent: item.parent,
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

const bumpVersionReducer = (acc, next) => {
  function checkUniqueness(acc, next) {
    const nextName = putTogetherFileName(next);
    const accNames = acc.map(itm => itm.newName);
    const isUnique = !accNames.includes(nextName);
    if (isUnique) {
      return next.version;
    } else {
      const nextToModify = { ...next };
      const bumpedVer = parseInt(next.version) + 1;
      nextToModify.version = bumpedVer;
      return checkUniqueness(acc, nextToModify);
    }
  }
  const uniqueVersion = checkUniqueness(acc, next);
  const modifiedItem = next;
  modifiedItem.version = uniqueVersion;
  modifiedItem.newName = putTogetherFileName(modifiedItem);
  acc.push(modifiedItem);
  return acc;
};

function bumpVersionOfDups(info) {
  const dupsBumped = R.reduce(bumpVersionReducer, [], info);
  return dupsBumped;
}

function putTogetherFileName(item) {
  const { date, version = "", tag, comment, newExt } = item;
  const ifCommentHasTag = checkIfCommentHasTag(comment, tag);
  const tagWithHyphen = makeTagWithHyphen(tag);
  const commentWithHyphen = makeCommentWithHyphen(comment);
  let newName;
  if (ifCommentHasTag) {
    newName = `${date}-${version}${commentWithHyphen}${newExt}`;
  } else {
    newName = `${date}-${version}${tagWithHyphen}${commentWithHyphen}${newExt}`;
  }
  return newName;
}

function checkIfCommentHasTag(comment, tag) {
  const isTagInComment = comment && comment.includes(tag);
  if (isTagInComment) {
    return true;
  } else {
    return false;
  }
}

const makeTagWithHyphen = tag =>
  typeof tag === "undefined" ? "" : ` - ${tag}`;

const makeCommentWithHyphen = comment =>
  typeof comment === "undefined"
    ? ""
    : typeof comment === "object"
      ? ""
      : ` - ${comment}`;

function reassemblyFileName(item) {
  const { oldName, date, tag } = item;
  if (date) {
    item.newName = putTogetherFileName(item);
  } else {
    if (item.tag) {
      item.newName = `${tag} - ${oldName}`;
    } else {
      item.newName = oldName;
    }
  }
  return item;
}

function addTag(walkOutput, tag, renameAfterParentDir) {
  const infoToRename = pullInfoFromWalk(walkOutput);
  const infoFromFileName = R.map(getInfoFromFileNameMapper, infoToRename);
  const xform = R.compose(
    R.map(renameAfterParentDir ? addParentDirAsTag : addTagToInfoObj(tag)),
    R.map(transformExtToLowerCase),
    R.map(transformExtLongJpeg),
    R.map(addVersions),
    R.map(reassemblyFileName)
  );
  const transducer = R.into([], xform);
  const renamedFiles = transducer(infoFromFileName);
  return renamedFiles;
}

const addTagToInfoObj = tag => item => {
  item.tag = tag;
  return item;
};

const addParentDirAsTag = item => {
  item.tag = item.parent;
  return item;
};

module.exports = {
  doRenameFilesForPresort,
  addTag
};
