/* eslint-disable no-console */

const { getAllFiles } = require("./walker.js");
const { addTag } = require("./rename.js");
const { renameFiles } = require("./rename-files.js");

async function runTaskRename(args) {
  try {
    const {
      cuSort,
      tag,
      renameAfterParentDir,
      dryRun,
      inputDir,
      excludeDirs
    } = args;
    if (excludeDirs) {
      const parsedExcludeDirs = parseExcludeDirs(excludeDirs);
      listExcludedDirs(parsedExcludeDirs);
    }
    let walkOutput = inputDir
      ? await getAllFiles(inputDir)
      : await getAllFiles(cuSort);
    //TODO: check if cuSort exists
    listReadFiles(walkOutput);
    if (inputDir) {
      console.log("\n[!] Passed custom input dir...");
      console.log(inputDir);
    }
    console.log("\n About to rename files...");
    const renamedFiles = addTag(walkOutput, tag, renameAfterParentDir);
    //TODOC: tag is ignored when renameAfterParentDir is passed as true
    if (dryRun) {
      console.log("[!][ WARN ] Dry run mode. Not renaming files on disk. \n");
      renamedFiles.forEach(item =>
        console.log(item.oldName, " --> ", item.newName)
      );
    } else {
      await renameFiles(renamedFiles);
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

//to utils
function parseExcludeDirs(strWithDirs) {
  const arrayOfDirs = strWithDirs.split(",").map(str => str.trim());
  return arrayOfDirs;
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
