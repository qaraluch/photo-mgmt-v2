const fs = require("fs-extra");
//[jprichardson/node-fs-extra: Node.js: extra methods for the fs object like copy(), remove(), mkdirs()](https://github.com/jprichardson/node-fs-extra)
const path = require("path");
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
        console.log("    -->", `to: ${destinationPath}`);
      } catch (error) {
        console.error("\n [!] Sth went wrong with rename-files: ");
        console.error(`       - ${error}`);
        console.error(`       - for file: ${item.path}`);
        console.error("       - Skipped rename!\n");
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
