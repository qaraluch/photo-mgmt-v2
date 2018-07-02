function getTimeStamp() {
  return (
    new Date()
      .toISOString()
      // modifies format of new Date '2012-11-04T14:51:06.157Z'
      .replace(/T/, "_")
      .replace(/:/g, "")
      .replace(/\..+/, "")
  );
}

module.exports = {
  getTimeStamp
};
