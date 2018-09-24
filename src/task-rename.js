/* eslint-disable no-console */

const { getAllFiles } = require("./walker.js");
const { addTag } = require("./rename.js");
const { renameFiles } = require("./rename-files.js");
const { parseExcludeDirs, chooseWhichPath } = require("./utils.js");

async function runTaskRename(args, log) {
  try {
    const {
      command,
      cwd,
      cuPresort,
      tag,
      renameAfterParentDir,
      dryRun,
      inputDir,
      excludeDirs
    } = args;
    log.startTask(command);
    log.argsTask(command, {
      cwd,
      cuPresort,
      tag,
      renameAfterParentDir,
      dryRun,
      inputDir,
      excludeDirs
    });
    let parsedExcludeDirs;
    const inputPath = chooseWhichPath(inputDir, cuPresort, cwd);
    log.inputDir(inputPath, command);
    if (excludeDirs) {
      parsedExcludeDirs = parseExcludeDirs(excludeDirs);
      log.excludedDirs(excludeDirs, parsedExcludeDirs);
    }
    let walkOutput = await getAllFiles(inputPath, parsedExcludeDirs);
    const numberFiles = walkOutput.length;
    log.numberFiles(numberFiles);
    //TODO: check if cuPresort or inputDir exists
    const renamedFiles = addTag(walkOutput, tag, renameAfterParentDir);
    log.renamedFiles(renamedFiles, command);
    if (dryRun) {
      log.dryRun();
    } else {
      log.renameInPlace();
      await renameFiles(renamedFiles);
    }
    return;
  } catch (error) {
    log.error(error);
  }
}

module.exports = runTaskRename;
