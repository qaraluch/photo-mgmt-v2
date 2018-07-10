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

//ES9 / node.js ^10.3.0
const regexFileName = /(?<date>\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2})(-)?(?<version>\d)?(\s)?([-|—])?(\s)?(?<comment>.+)?/;

function parseExistedFileName(item) {
  const { oldBaseName } = item;
  const match = regexFileName.exec(oldBaseName);
  item.date = match && match.groups.date;
  item.version = match && match.groups.version;
  item.comment = match && match.groups.comment;
  item.comment && (item.comment = item.comment.trim());
  return item;
}

module.exports = {
  getFileTimeStamp,
  regexFileName,
  parseExistedFileName,
  getDateFromMetadata
};
