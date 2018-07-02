const walk = require("qm-walk");

async function getAllFiles(scanPath) {
  const walkOutputExt = await walk({ path: scanPath });
  const paths = walkOutputExt.getExtendedInfo().result;
  const files = paths.map(item => item.isFile && item);
  return files;
}

module.exports = {
  getAllFiles
};
