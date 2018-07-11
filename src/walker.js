const walk = require("qm-walk");

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
  const walkOutputExt = await walk({ path: scanPath });
  const paths = walkOutputExt.getExtendedInfo().match(glob);
  const files = paths.map(item => item.isFile && item);
  return files;
}

module.exports = {
  getAllFiles
};
