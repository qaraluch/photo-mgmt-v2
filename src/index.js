//task dependencies
const taskBackup = require("./task-backup.js");

//configs:
const configTest = {
  // Source dir Camera Upload from Dropbox
  cu: "./test/fixtures/cu/",
  // backup folder for CU
  cuBackup: "./test/fixtures/cu-backup/",
  // Destination Dir for cu-presort
  cuSort: "./test/fixtures/cu-sort/"
};

//commands:
const commandBackup = { command: "backup", config: "configTest" };

runThis(commandBackup);

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
      ? await taskBackup(argsTaskCommand)
      : console.log(`Not found this '${command}'!`);
  console.log("DONE!");
}

function chooseConfig(configName) {
  const chosen = configName === "configTest" ? configTest : configTest;
  return chosen;
}
