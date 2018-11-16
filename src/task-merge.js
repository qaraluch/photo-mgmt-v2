/* eslint-disable no-console */
const makeDir = require("make-dir");

const { getAllFiles } = require("./walker.js");
const { mergeRename } = require("./rename.js");
const { moveFilesTo } = require("./move-files.js");
const { chooseWhichPath, getFileTimeStamp } = require("./utils.js");

async function runTaskMerge(args, log) {
  try {
    const {
      cwd,
      command,
      positional,
      mergeDirsInput,
      mergedDirName,
      dryRun,
      outputDir
    } = args;
    log.startTask(command);
    log.argsTask(command, {
      cwd,
      positional,
      dryRun,
      mergeDirsInput,
      mergedDirName,
      outputDir
    });
    const outputPath = chooseWhichPath(
      outputDir,
      mergedDirName,
      `./temp-merged-${getFileTimeStamp()}`
    );
    await makeDir(outputPath);
    const inputPaths = chooseWhichPath(positional, mergeDirsInput, cwd);
    log.inputDirs(inputPaths, command);
    const walkOutputPromises = inputPaths.map(path => getAllFiles(path));
    const walkOutputArray = await Promise.all(walkOutputPromises);
    const walkOutput = [].concat(...walkOutputArray);
    const numberFiles = walkOutput.length;
    log.numberFiles(numberFiles);
    const [filesToMove, filesNotToMove] = mergeRename(walkOutput);
    log.mergeFiles(filesToMove, outputPath, command);
    if (filesNotToMove.length > 0) {
      log.notMergeFiles(filesNotToMove, command);
    }
    if (dryRun) {
      log.dryRun();
    } else {
      await moveFilesTo(filesToMove, outputPath);
    }
    return;
  } catch (error) {
    log.error(error);
  }
}

module.exports = runTaskMerge;
