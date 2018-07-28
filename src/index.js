/* eslint-disable no-console */
//task dependencies
const execTaskBackup = require("./task-backup.js");
const execTaskPresort = require("./task-presort.js");
const execTaskRename = require("./task-rename.js");

//configs:
const configTest = {
  // Source dir Camera Upload from Dropbox
  cu: "./test/fixtures/cu/",
  // backup folder for CU
  cuBackup: "./test/fixtures/cu-backup/",
  // Destination Dir for cu-presort
  cuSort: "./test/fixtures/cu-sort/"
};

const configTestRename = {
  // Source dir Camera Upload from Dropbox
  cu: "./test/fixtures/cu/",
  // backup folder for CU
  cuBackup: "./test/fixtures/cu-backup/",
  // Destination Dir for cu-presort
  cuSort: "./test/fixtures/cu-sort-rename/"
};

const configCU = {
  // Source dir Camera Upload from Dropbox
  cu: "/mnt/g/Dropbox/Camera Uploads/",
  // backup folder for CU
  cuBackup: "/mnt/g/.temp/cuBackup/",
  // Destination Dir for cu-presort
  cuSort: "/mnt/g/Dropbox/mydrocsort/"
};

//commands:
const commandBackup = {
  command: "backup",
  config: "configTest",
  dryRun: false,
  checkArchive: true
};

const commandBackupReal = {
  command: "backup",
  config: "configCU",
  dryRun: false,
  checkArchive: true
};

// runThis(commandBackup);
// runThis(commandBackupReal);

const commandPresort = {
  command: "presort",
  config: "configTest",
  dryRun: false
};

const commandPresortReal = {
  command: "presort",
  config: "configCU",
  dryRun: false
};

// runThis(commandPresort);
// runThis(commandPresortReal);

const commandRename = {
  command: "rename",
  config: "configTestRename",
  dryRun: false,
  tag: "myTag"
};

// runThis(commandRename);

const commandRenameAfterParentDir = {
  command: "rename",
  config: "configTestRename",
  dryRun: false,
  renameAfterParentDir: true
};

const commandRenameAfterParentDirInputDir = {
  command: "rename",
  config: "configTestRename",
  dryRun: false,
  renameAfterParentDir: true,
  inputDir: "./test/fixtures/cu-sort-rename/some-dir/"
};

const commandRenameAfterParentDirExcludeDirs = {
  command: "rename",
  config: "configTestRename",
  dryRun: false,
  renameAfterParentDir: true,
  excludeDirs: "some-dir, terefere"
};

const commandRenameAfterParentDirReal = {
  command: "rename",
  config: "configCU",
  dryRun: true,
  renameAfterParentDir: true,
  excludeDirs:
    "_camera-save, _filmiki, _grafa_assets, _luzne, _modyf, _ogolne, _org, _piony, _rys_duplikaty, _slides-ep, _slides-nasze, _temp"
};

const commandRenameAfterParentDirRealPeru = {
  command: "rename",
  config: "configCU",
  dryRun: false,
  renameAfterParentDir: true,
  inputDir: "/mnt/g/Dropbox/mydrocsort/warszawa"
};

// runThis(commandRenameAfterParentDir);
// runThis(commandRenameAfterParentDirInputDir);
// runThis(commandRenameAfterParentDirExcludeDirs);

// runThis(commandRenameAfterParentDirReal);
runThis(commandRenameAfterParentDirRealPeru);

//index.js
async function runThis(taskCommand) {
  const { command, config } = taskCommand;
  const configChosen = chooseConfig(config);
  const argsTaskCommand = Object.assign({}, configChosen, taskCommand);
  console.log("About to run task...");
  console.log(command);
  console.log(` of CU dir: ${configChosen.cu}`);
  const taskCommandChosen =
    command === "backup"
      ? await execTaskBackup(argsTaskCommand)
      : command === "presort"
        ? await execTaskPresort(argsTaskCommand)
        : command === "rename"
          ? await execTaskRename(argsTaskCommand)
          : console.log(`Not found this '${command}'!`);
  console.log("DONE!");
}

function chooseConfig(configName) {
  const chosen =
    configName === "configTest"
      ? configTest
      : configName === "configTestRename"
        ? configTestRename
        : configName === "configCU"
          ? configCU
          : configTest;
  return chosen;
}
