const walk = require("qm-walk");
const path = require("path");

const glob = [
  "*.jpg",
  "*.jpeg",
  "*.JPG",
  "*.JPEG",
  "*.png",
  "*.PNG",
  "*.mp4",
  "*.MP4",
  "*.gif",
  "*.GIF"
];

async function getAllFiles(scanPath) {
  const scanPathResolved = path.resolve(scanPath);
  const walkOutputExt = await walk({ path: scanPathResolved });
  const paths = walkOutputExt.getExtendedInfo().match(glob);
  const files = paths.map(item => item.isFile && item);
  return files;
}

module.exports = {
  getAllFiles
};
