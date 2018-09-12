const { runThis } = require("./src/index.js");

//Manual run:
//Edit and run this by: `nps run`

const commandBackup = {
  command: "backup",
  config: "configTest",
  checkArchive: true
};

const commandBackupReal = {
  command: "backup",
  config: "configCU",
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
  inputDir: "./test/fixtures/cu-presort-rename/some-dir/"
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

const commandRenameAfterParentDirRealInput = {
  command: "rename",
  config: "configCU",
  dryRun: false,
  renameAfterParentDir: true,
  inputDir: "/mnt/g/Dropbox/mydrocsort/warszawa"
};

// runThis(commandRenameAfterParentDir);
// runThis(commandRenameAfterParentDirExcludeDirs);
// runThis(commandRenameAfterParentDirInputDir);

// runThis(commandRenameAfterParentDirReal);
// runThis(commandRenameAfterParentDirRealInput);
