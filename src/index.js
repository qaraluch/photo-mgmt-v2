/* eslint-disable no-console */
//task dependencies
const execTaskBackup = require("./task-backup.js");
const execTaskPresort = require("./task-presort.js");
const execTaskRename = require("./task-rename.js");
const { resolveOptions } = require("./utils.js");

//configs:
const configTest = {
  // Source dir Camera Upload from Dropbox
  cu: "./test/fixtures/cu/",
  // backup folder for CU
  cuBackup: "./test/fixtures/cu-backup/",
  // Destination Dir for cu-presort
  cuPresort: "./test/fixtures/cu-presort/"
};

const configTestRename = {
  // Source dir Camera Upload from Dropbox
  cu: "./test/fixtures/cu/",
  // backup folder for CU
  cuBackup: "./test/fixtures/cu-backup/",
  // Destination Dir for cu-presort
  cuPresort: "./test/fixtures/cu-presort-rename/"
};

const configCU = {
  // Source dir Camera Upload from Dropbox
  cu: "/mnt/g/Dropbox/Camera Uploads/",
  // backup folder for CU
  cuBackup: "/mnt/g/.temp/cuBackup/",
  // Destination Dir for cu-presort
  cuPresort: "/mnt/g/Dropbox/mydrocsort/",
  excludeDirs:
    "_camera-save, _filmiki, _grafa_assets, _luzne, _modyf, _ogolne, _org, _piony, _rys_duplikaty, _slides-ep, _slides-nasze, _temp"
};

async function runThis(taskCommand) {
  const cwd = { cwd: process.cwd() };
  const { command, config } = taskCommand;
  const configChosen = chooseConfig(config);
  console.log("configChosen ", configChosen.excludeDirs);
  const argsTaskCommand = resolveOptions({}, cwd, configChosen, taskCommand);
  console.log("About to run task...");
  console.log(command);
  const taskCommandChosen =
    command === "backup"
      ? await execTaskBackup(argsTaskCommand)
      : command === "presort"
        ? await execTaskPresort(argsTaskCommand)
        : command === "rename"
          ? await execTaskRename(argsTaskCommand)
          : console.log(`Not found this '${command}' command!`);
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

function runFromCli(args) {
  const cliCommand = args.input[0];
  const flags = args.flags;
  const command = Object.assign({}, { command: cliCommand }, flags);
  // console.log("-->", args.input);
  // console.log("-->", args.flags);
  // console.log("command ", command);
  runThis(command);
}

module.exports = {
  runFromCli,
  runThis
};
