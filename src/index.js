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

function runFromCli(args) {
  // console.log("-->", args.input);
  // console.log("-->", args.flags);
  const command = args.input[0];
  const flags = args.flags;
  const commandObj = Object.assign({}, { command }, flags);
  console.log("commandObj ", commandObj);
  runThis(commandObj);
}

module.exports = {
  runFromCli,
  runThis
};
