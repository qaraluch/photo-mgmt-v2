function getDate(passedDate) {
  const currentDate = new Date();
  const currentDateMs = currentDate.getTime();
  const passedDateValue = new Date(passedDate).getTime();
  const timeZoneOffsetMs = currentDate.getTimezoneOffset() * 60 * 1000;
  const theDate = new Date(
    (passedDateValue || currentDateMs) - timeZoneOffsetMs
  );
  return theDate.toISOString();
}

const getFileTimeStamp = passDateValue =>
  getDate(passDateValue)
    .replace(/T/, "_")
    .replace(/:/g, "")
    .replace(/\..+/, "");

const getDateFromMetadata = passDateValue =>
  getDate(passDateValue)
    .replace(/T/, " ")
    .replace(/\..+/, "")
    .replace(/:/g, ".");

const correctExifDate = dateStr =>
  dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})(.+)/, "$1-$2-$3$4");

//ES9 - ES2018 - RegExp named capture groups - node.js ^10.3.0
const regexFileName = /(?<date>\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2})(-)?(?<version>\d)?(\s)?([-|—])?(\s)?(?<comment>.+)?/;

function parseExistedFileName(baseName) {
  const match = regexFileName.exec(baseName);
  const date = match && match.groups.date;
  const version = match && match.groups.version;
  const commentRaw = match && match.groups.comment;
  const comment = commentRaw && commentRaw.trim();
  const resultObj = { date, version, comment };
  return resultObj;
}

function checkPropernessFileName(baseName) {
  const result = regexFileName.test(baseName);
  return result;
}

function parseExcludeDirs(strWithDirs) {
  const arrayOfDirs = strWithDirs.split(",").map(str => str.trim());
  return arrayOfDirs;
}

function checkIfOneStringIncludesNext(strFirst, strSecond) {
  const check = strFirst && strFirst.includes(strSecond);
  return check;
}

const prependStringWithHyphen = str =>
  typeof str === "undefined" ? "" : ` - ${str}`;

function resolveOptions(defaultOptions, ...options) {
  const optionsMapper = opt =>
    Object.entries(opt)
      .filter(([_, value]) => typeof value !== "undefined")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  const endOptions = Object.assign(
    {},
    defaultOptions,
    ...options.map(optionsMapper)
  );
  return endOptions;
}

function chooseWhichPath(flagPath, configPath, cwdPath) {
  const chosen =
    flagPath === undefined ? configPath : flagPath === "" ? cwdPath : flagPath;
  return chosen;
}

module.exports = {
  getFileTimeStamp,
  regexFileName,
  parseExistedFileName,
  getDateFromMetadata,
  correctExifDate,
  parseExcludeDirs,
  checkIfOneStringIncludesNext,
  prependStringWithHyphen,
  resolveOptions,
  chooseWhichPath,
  checkPropernessFileName
};
