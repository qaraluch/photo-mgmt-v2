const walk = require("qm-walk");
const path = require("path");

const globOptions = { nocase: true };
//TODOC: case insensitive extension files.

const glob = ["*.jpg", "*.jpeg", "*.png", "*.mp4", "*.gif"];
//TODOC: list of supported extensions.

async function getAllFiles(scanPath, filterOut) {
  const scanPathResolved = path.resolve(scanPath);
  const walkOutputExt = await walk({ path: scanPathResolved, filterOut });
  const paths = walkOutputExt.getExtendedInfo().match(glob, globOptions);
  const files = paths.map(item => item.isFile && item);
  return files;
}

module.exports = {
  getAllFiles
};
