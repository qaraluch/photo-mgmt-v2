/* eslint-disable no-console */
const makeDir = require("make-dir");

const { getAllFiles } = require("./walker.js");
const { doRenameFilesForPresort } = require("./rename.js");
const { moveFilesTo } = require("./move-files.js");
const { chooseWhichPath, getFileTimeStamp } = require("./utils.js");

async function runTaskPresort(args, log) {
  try {
    const { cwd, command, cu, cuPresort, dryRun, inputDir, outputDir } = args;
    log.startTask(command);
    log.argsTask(command, {
      cwd,
      cu,
      cuPresort,
      dryRun,
      inputDir,
      outputDir
    });
    const inputPath = chooseWhichPath(inputDir, cu, cwd);
    log.inputDir(inputPath, command);
    const outputPath = chooseWhichPathPresort(
      outputDir,
      cuPresort,
      `./temp-cu-presort-${getFileTimeStamp()}`
    );
    const walkOutput = await getAllFiles(inputPath);
    const numberFiles = walkOutput.length;
    log.numberFiles(numberFiles);
    await makeDir(outputPath);
    const renamedFiles = await doRenameFilesForPresort(walkOutput);
    log.renamedFiles(renamedFiles, command);
    if (dryRun) {
      log.dryRun();
    } else {
      log.outputDirForMove(outputPath);
      await moveFilesTo(renamedFiles, outputPath);
    }
    return;
  } catch (error) {
    log.error(error);
  }
}

// special case for presort
function chooseWhichPathPresort(flagPath, configPath, cwdPath) {
  const chosen =
    flagPath === undefined ? cwdPath : flagPath === "" ? cwdPath : flagPath;
  return chosen;
}

module.exports = runTaskPresort;
