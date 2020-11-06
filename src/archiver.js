const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
//[archiverjs/node-archiver: a streaming interface for archive generation](https://github.com/archiverjs/node-archiver)

const execa = require("execa");
//[sindresorhus/execa: A better `child_process`](https://github.com/sindresorhus/execa)

function archiveIt(backupFilePath, toBackupFilesPaths) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(backupFilePath);
    const archive = archiver("zip");

    output.on("close", function () {
      const size = archive.pointer();
      resolve(size);
    });

    // output.on("end", function() {
    //   console.log("Data has been drained");
    // });

    // archive.on("warning", function(err) {
    //   if (err.code === "ENOENT") {
    //     console.log("Some ENOENT");
    //   } else {
    //     reject(err);
    //   }
    // });

    archive.on("warning", function (err) {
      reject(err);
    });

    archive.on("error", function (err) {
      reject(err);
    });

    archive.pipe(output);

    toBackupFilesPaths.forEach((pth) => {
      archive.file(pth[0], {
        name: `${path.basename(backupFilePath, ".zip")}/${pth[1]}`, //see: copyPathsForBackup
      });
    });

    archive.finalize();
  });
}

async function spawnCheckArchive(filePath) {
  const { stdout } = await execa(`zipinfo -1s ${filePath}`, { shell: true });
  return stdout;
  //TODO:  fix this error:
  // [photo-mgmt] › ✖  error     Error: Command failed with ENOENT: zipinfo -1s /mnt/j/f-mgmt-input-backup/inbox-fotki-arch-2020-11-06_131600.zip
  // spawn zipinfo -1s /mnt/j/f-mgmt-input-backup/inbox-fotki-arch-2020-11-06_131600.zip ENOENT
  // at Process.ChildProcess._handle.onexit (node:internal/child_process:269:19)
  // at onErrorNT (node:internal/child_process:465:16)
  // at processTicksAndRejections (node:internal/process/task_queues:80:21)
}

module.exports = {
  archiveIt,
  spawnCheckArchive,
};
