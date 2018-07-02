//task dependencies
const execTaskBackup = require("./task-backup.js");
const execTaskPresortVids = require("./task-presort-vids.js");

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

const commandPresortVids = {
  command: "presort-vids",
  config: "configTest"
};

// runThis(commandBackup);
// runThis(commandBackupReal);
runThis(commandPresortVids);

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
      : command === "presort-vids"
        ? await execTaskPresortVids(argsTaskCommand)
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
