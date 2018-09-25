const path = require("path");

const fs = require("fs-extra");
//[jprichardson/node-fs-extra: Node.js: extra methods for the fs object like copy(), remove(), mkdirs()](https://github.com/jprichardson/node-fs-extra)

const throat = require("throat");
//[ForbesLindesay/throat: Throttle a collection of promise returning functions](https://github.com/ForbesLindesay/throat)

async function renameFiles(filesInfo) {
  async function doRenameFiles(item) {
    const getDir = fileName => path.parse(fileName).dir;
    const dir = getDir(item.path);
    const destinationPath = path.resolve(dir, item.newName);
    if (item.path !== destinationPath) {
      try {
        await fs.move(item.path, destinationPath);
      } catch (error) {
        throw new Error(
          `[!] Sth went wrong with rename-files: \n
           - ${error}
           - for file: ${item.path}
           - Skipped rename!`
        );
      }
    }
    return;
  }
  const promises = filesInfo.map(throat(4, doRenameFiles, Promise.resolve()));
  await Promise.all(promises);
}

module.exports = {
  renameFiles
};
