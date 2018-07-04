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
      const info = await ep.readMetadata(item.path, ["-File:all"]);
      item.exif = info.data[0];
      if (info.error) throw info.error;
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
  getExifData
};
