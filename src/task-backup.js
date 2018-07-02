const walk = require("qm-walk");
const makeDir = require("make-dir");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const execa = require("execa");

async function runTaskBackup(args) {
  try {
    const { cu, cuBackup, checkArchive } = args;
    const walkOutput = await getAllCuFiles(cu);
    await makeDir(cuBackup);
    listReadFiles(walkOutput);
    const toBackupFilesPaths = copyPathsForBackup(walkOutput);
    const backupFile = constructBackupFileName();
    const backupFilePath = path.resolve(cuBackup, backupFile);
    console.log("About to create zip file:");
    console.log(` ${backupFile}`);
    console.log("in:");
    console.log(` ${cuBackup}`);
    await archiveIt(backupFilePath, toBackupFilesPaths);
    if (checkArchive) {
      console.log("Checking archive file: ...");
      const { stdout } = await execa.shell(`zipinfo -1s ${backupFilePath}`);
      console.log(stdout);
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

async function getAllCuFiles(scanPath) {
  const walkOutputExt = await walk({ path: scanPath });
  const paths = walkOutputExt.getExtendedInfo().result;
  const files = paths.map(item => item.isFile && item);
  return files;
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

function archiveIt(backupFilePath, toBackupFilesPaths) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(backupFilePath);
    const archive = archiver("zip");

    output.on("close", function() {
      const size = archive.pointer();
      console.log(size + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
      resolve(size);
    });

    output.on("end", function() {
      console.log("Data has been drained");
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on("warning", function(err) {
      if (err.code === "ENOENT") {
        console.log("Some ENOENT");
      } else {
        reject(err);
      }
    });

    archive.on("error", function(err) {
      reject(err);
    });

    archive.pipe(output);

    toBackupFilesPaths.forEach(pth => {
      archive.file(pth, {
        name: `${path.basename(backupFilePath, ".zip")}/${path.basename(pth)}`
      });
    });

    archive.finalize();
  });
}
module.exports = runTaskBackup;
