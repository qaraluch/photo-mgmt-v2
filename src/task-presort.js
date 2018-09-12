/* eslint-disable no-console */
const makeDir = require("make-dir");

const { getAllFiles } = require("./walker.js");
const { doRenameFilesForPresort } = require("./rename.js");
const { moveFilesTo } = require("./move-files.js");
const { chooseWhichPath, getFileTimeStamp } = require("./utils.js");

async function runTaskPresort(args) {
  try {
    const { cwd, cu, cuPresort, dryRun, inputDir, outputDir } = args;
    const inputPath = chooseWhichPath(inputDir, cu, cwd);
    const outputPath = chooseWhichPath(
      outputDir,
      cuPresort,
      `./temp-cu-presort-${getFileTimeStamp()}`
    );
    const walkOutput = await getAllFiles(inputPath);
    await makeDir(outputPath);
    listReadFiles(walkOutput);
    console.log("\n About to rename files...");
    const renamedFiles = await doRenameFilesForPresort(walkOutput);
    console.log("\n Moving files ...");
    console.log(`   - to dir: ${outputPath}`);
    if (dryRun) {
      console.log("[!][ WARN ] Dry run mode. Not renaming files on disk. \n");
      renamedFiles.forEach(item =>
        console.log(item.oldName, " --> ", item.newName)
      );
    } else {
      await moveFilesTo(renamedFiles, outputPath);
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

module.exports = runTaskPresort;
