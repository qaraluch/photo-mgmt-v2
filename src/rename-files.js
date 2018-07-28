const fs = require("fs");
const util = require("util");
const path = require("path");
const renameP = util.promisify(fs.rename);
const throat = require("throat");
//[ForbesLindesay/throat: Throttle a collection of promise returning functions](https://github.com/ForbesLindesay/throat)

async function renameFiles(filesInfo) {
  async function doRenameFiles(item) {
    const getDir = fileName => path.parse(fileName).dir;
    const dir = getDir(item.path);
    const destinationPath = path.resolve(dir, item.newName);
    if (item.path !== destinationPath) {
      await renameP(item.path, destinationPath);
      console.log("    -->", `to: ${destinationPath}`);
    }
    return;
  }
  const promises = filesInfo.map(throat(4, doRenameFiles, Promise.resolve()));
  await Promise.all(promises);
}

module.exports = {
  renameFiles
};
