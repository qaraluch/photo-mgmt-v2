/* eslint-disable no-console */
const path = require("path");
const makeDir = require("make-dir");

const { getFileTimeStamp, chooseWhichPath } = require("./utils.js");
const { getAllFiles } = require("./walker.js");
const { archiveIt, spawnCheckArchive } = require("./archiver.js");

async function runTaskBackup(args) {
  try {
    const {
      cwd,
      cu,
      cuBackup,
      checkArchive,
      inputDir,
      outputDir,
      prefixArchiveName
    } = args;
    const inputPath = chooseWhichPath(inputDir, cu, cwd);
    console.log("Content of dir: ", inputPath);
    const outputPath = chooseWhichPath(outputDir, cuBackup, cwd);
    const walkOutput = await getAllFiles(inputPath);
    await makeDir(outputPath);
    listReadFiles(walkOutput);
    const getPathsFilesToArchive = copyPathsForBackup(walkOutput);
    const backupFile = constructBackupFileName(prefixArchiveName, inputPath);
    const backupFilePath = path.resolve(outputPath, backupFile);
    console.log("About to create zip file:");
    console.log(` ${backupFile}`);
    console.log("in:");
    console.log(` ${outputPath}`);
    await archiveIt(backupFilePath, getPathsFilesToArchive);
    if (checkArchive) {
      console.log("Checking archive file: ...");
      const stdoutCommunicate = await spawnCheckArchive(backupFilePath);
      console.log(stdoutCommunicate);
    }
    return;
  } catch (error) {
    console.error(error);
  }
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

function constructBackupFileName(prefixArchiveName, inputPath) {
  const prefixChose =
    prefixArchiveName === "" ? path.basename(inputPath) : prefixArchiveName;
  const fileName = `${prefixChose}-${getFileTimeStamp()}.zip`;
  return fileName;
}

module.exports = runTaskBackup;
