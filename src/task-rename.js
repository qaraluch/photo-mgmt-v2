/* eslint-disable no-console */

const { getAllFiles } = require("./walker.js");
const { addTag } = require("./rename.js");
const { renameFiles } = require("./rename-files.js");
const { parseExcludeDirs, chooseWhichPath } = require("./utils.js");

async function runTaskRename(args) {
  try {
    const {
      cwd,
      cuPresort,
      tag,
      renameAfterParentDir,
      dryRun,
      inputDir,
      excludeDirs
    } = args;
    let parsedExcludeDirs;
    if (excludeDirs) {
      parsedExcludeDirs = parseExcludeDirs(excludeDirs);
      listExcludedDirs(parsedExcludeDirs);
    }
    const inputPath = chooseWhichPath(inputDir, cuPresort, cwd);
    let walkOutput = await getAllFiles(inputPath, parsedExcludeDirs);
    //TODO: check if cuPresort or inputDir exists
    listReadFiles(walkOutput);
    if (inputDir || inputDir === "") {
      console.log("\n[!] Passed custom input dir...");
      console.log(inputPath);
    }
    console.log("\n About to rename files...");
    const renamedFiles = addTag(walkOutput, tag, renameAfterParentDir);
    if (dryRun) {
      console.log("[!][ WARN ] Dry run mode. Not renaming files on disk. \n");
      renamedFiles.forEach(item => {
        if (item.oldName !== item.newName) {
          console.log(item.oldName, " --> ", item.newName);
        }
      });
    } else {
      await renameFiles(renamedFiles);
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

function listExcludedDirs(dirs) {
  console.log("Excluded dirs:");
  dirs.forEach(item => {
    console.log("-->", item);
  });
}

function listReadFiles(files) {
  console.log("Read files:");
  listFiles(files);
}

function listFiles(files) {
  files.forEach(item => {
    console.log("-->", item.name);
  });
}

module.exports = runTaskRename;
