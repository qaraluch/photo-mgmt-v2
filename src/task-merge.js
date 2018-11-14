/* eslint-disable no-console */
const makeDir = require("make-dir");

const { getAllFiles } = require("./walker.js");
const { mergeRename } = require("./rename.js");
const { moveFilesTo } = require("./move-files.js");
const { chooseWhichPath } = require("./utils.js");

async function runTaskMerge(args, log) {
  try {
    const {
      cwd,
      command,
      mergeDirsInput,
      mergedDirName,
      dryRun,
      inputDir,
      outputDir
    } = args;
    log.startTask(command);
    log.argsTask(command, {
      cwd,
      dryRun,
      inputDir,
      outputDir
    });
    const outputPath = chooseWhichPath(outputDir, mergedDirName, cwd);
    await makeDir(outputPath);
    log.inputDirs(mergeDirsInput, command);
    const walkOutputPromises = mergeDirsInput.map(path => getAllFiles(path));
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
