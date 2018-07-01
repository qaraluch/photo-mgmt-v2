const walk = require("qm-walk");
const makeDir = require("make-dir");

async function runTaskBackup(args) {
  try {
    const { cu, cuBackup } = args;
    const walkOutput = await getAllCuFiles(cu);
    await makeDir(cuBackup);
    listReadFiles(walkOutput);
    const backupPaths = copyPathsForBackup(walkOutput);
    const backupFile = constructBackupFileName();
    console.log("About to create zip file:");
    console.log(` ${backupFile}`);
    console.log("in:");
    console.log(` ${cuBackup}`);
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

function constructBackupFileName() {
  const fileName = `cu-temp-arch-${getTimeStamp()}.zip`;
  return fileName;
}

function getTimeStamp() {
  return (
    new Date()
      .toISOString()
      // modifies format of new Date '2012-11-04T14:51:06.157Z'
      .replace(/T/, "_")
      .replace(/:/g, "")
      .replace(/\..+/, "")
  );
}

module.exports = runTaskBackup;
