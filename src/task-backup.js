const walk = require("qm-walk");

async function runTaskBackup(args) {
  const { cu } = args;
  const walkOutput = await getAllCuFiles(cu);
  listReadFiles(walkOutput);
  const backupPaths = copyPathsForBackup(walkOutput);
}

async function getAllCuFiles(scanPath) {
  const walkOutputExt = await walk({ path: scanPath });
  const paths = walkOutputExt.getExtendedInfo().result;
  return paths;
}

function listReadFiles(walkOutput) {
  console.log("Read files:");
  listFiles(walkOutput);
}

function listFiles(walkOutput) {
  walkOutput.forEach(item => {
    console.log("-->", item.name);
  });
}

function copyPathsForBackup(walkOutput) {
  const copyPaths = [...walkOutput.map(item => item.path)];
  return copyPaths;
}

module.exports = runTaskBackup;
