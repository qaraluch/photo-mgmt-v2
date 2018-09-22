/* eslint-disable no-console */
const path = require("path");
const makeDir = require("make-dir");

const { getFileTimeStamp, chooseWhichPath, hookStdout } = require("./utils.js");
const { getAllFiles } = require("./walker.js");
const { archiveIt, spawnCheckArchive } = require("./archiver.js");

async function runTaskBackup(args, log) {
  try {
    const {
      command,
      cwd,
      cu,
      cuBackup,
      checkArchive,
      inputDir,
      outputDir,
      prefixArchiveName
    } = args;
    log.startTask(command);
    log.argsTask(command, {
      cwd,
      cu,
      cuBackup,
      checkArchive,
      inputDir,
      outputDir,
      prefixArchiveName
    });
    const inputPath = chooseWhichPath(inputDir, cu, cwd);
    // console.log("Content of dir: ", inputPath);
    log.inputForBackup(inputPath);
    const outputPath = chooseWhichPath(outputDir, cuBackup, cwd);
    const walkOutput = await getAllFiles(inputPath);
    const numberFiles = walkOutput.length;
    log.numberFiles(numberFiles);
    await makeDir(outputPath);
    const getPathsFilesToArchive = copyPathsForBackup(walkOutput);
    const backupFile = constructBackupFileName(prefixArchiveName, inputPath);
    const backupFilePath = path.resolve(outputPath, backupFile);
    log.outputForBackup(outputPath, backupFile, backupFilePath);
    const ilog = log.startZipping();
    const zipStdout = [];
    const unhookStdOut = hookStdout((string, enc, fd) => {
      zipStdout.push(string);
    });
    await archiveIt(backupFilePath, getPathsFilesToArchive);
    unhookStdOut();
    log.endZipping(ilog);
    log.showZipSize(zipStdout);
    // if (checkArchive) {
    //   console.log("Checking archive file: ...");
    //   const stdoutCommunicate = await spawnCheckArchive(backupFilePath);
    //   console.log(stdoutCommunicate);
    // }
    // return;
  } catch (error) {
    console.error(error);
  }
}

function copyPathsForBackup(walkOutput) {
  const copyPaths = [...walkOutput.map(item => [item.path, item.crown])]; // arr[1] - internal archive dir structure
  return copyPaths;
}

function constructBackupFileName(prefixArchiveName, inputPath) {
  const prefixChose =
    prefixArchiveName === "" ? path.basename(inputPath) : prefixArchiveName;
  const fileName = `${prefixChose}-${getFileTimeStamp()}.zip`;
  return fileName;
}

module.exports = runTaskBackup;
