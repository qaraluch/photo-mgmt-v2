function getDate({ passDate = undefined } = {}) {
  const choosenDate = passDate ? new Date(passDate) : new Date();
  return (
    choosenDate
      .toISOString()
      // modifies format of new Date '2012-11-04T14:51:06.157Z'
      .replace(/T/, "_")
      .replace(/:/g, "")
      .replace(/\..+/, "")
  );
}

function getTimeStamp() {
  return getDate();
}

function parseStatsDate(dateStr) {
  return getDate({ passDate: dateStr });
}

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
  getTimeStamp,
  regexFileName,
  parseExistedFileName,
  parseStatsDate
};
