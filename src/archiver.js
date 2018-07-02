const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const execa = require("execa");

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

async function spawnCheckArchive(filePath) {
  const { stdout } = await execa.shell(`zipinfo -1s ${filePath}`);
  return stdout;
}

module.exports = {
  archiveIt,
  spawnCheckArchive
};
