const path = require("path");
const moveFile = require("move-file");
const throat = require("throat");
//[ForbesLindesay/throat: Throttle a collection of promise returning functions](https://github.com/ForbesLindesay/throat)

async function moveFilesTo(filesInfo, destination) {
  const options = { overwrite: false };
  async function renameFiles(item) {
    const destinationPath = path.resolve(destination, item.newName);
    await moveFile(item.path, destinationPath, options);
    console.log("    -->", `to: ${destinationPath}`);
    return;
  }
  const promises = filesInfo.map(throat(4, renameFiles, Promise.resolve()));
  await Promise.all(promises);
}

module.exports = {
  moveFilesTo
};
