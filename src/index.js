//task dependencies
const execTaskBackup = require("./task-backup.js");
const execTaskPresort = require("./task-presort.js");

//configs:
const configTest = {
  // Source dir Camera Upload from Dropbox
  cu: "./test/fixtures/cu/",
  // backup folder for CU
  cuBackup: "./test/fixtures/cu-backup/",
  // Destination Dir for cu-presort
  cuSort: "./test/fixtures/cu-sort/"
};

const configCU = {
  // Source dir Camera Upload from Dropbox
  cu: "/mnt/g/Dropbox/Camera Uploads/",
  // backup folder for CU
  cuBackup: "/mnt/g/.temp/cuBackup/",
  // Detination Dir for cu-presort
  cuSort: "/mnt/g/Dropbox/mydrocsort/"
};

//commands:
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

const commandPresort = {
  command: "presort",
  config: "configTest"
};

const commandPresortReal = {
  command: "presort",
  config: "configCU"
};

// runThis(commandBackup);
// runThis(commandBackupReal);
runThis(commandPresort);
// runThis(commandPresortReal);

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
        : console.log(`Not found this '${command}'!`);
  console.log("DONE!");
}

function chooseConfig(configName) {
  const chosen =
    configName === "configTest"
      ? configTest
      : configName === "configCU"
        ? configCU
        : configTest;
  return chosen;
}
