const walk = require("qm-walk");
const makeDir = require("make-dir");

async function runTaskBackup(args) {
  try {
    const { cu, cuBackup } = args;
    const walkOutput = await getAllCuFiles(cu);
    await makeDir(cuBackup);
    listReadFiles(walkOutput);
    const backupPaths = copyPathsForBackup(walkOutput);
  } catch (error) {
    console.error(error);
  }
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
