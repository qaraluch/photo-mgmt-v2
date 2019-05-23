/* eslint-disable no-console */
const execTaskBackup = require("./task-backup.js");
const execTaskPresort = require("./task-presort.js");
const execTaskRename = require("./task-rename.js");
const execTaskMerge = require("./task-merge.js");
const { initLogger } = require("./logger.js"); //initUiLogger
const resolveAllOptions = require("./config.js");

async function runThis(args) {
  try {
    const endOptions = resolveAllOptions(args);
    const {
      command,
      delimiter,
      silent,
      disableFileLogs,
      logFilePrefix,
      logOutputDir
    } = endOptions;
    const logOptions = {
      delimiter,
      silent,
      disableFileLogs,
      logFilePrefix,
      logOutputDir
    };
    const log = await initLogger({ logOptions }); // bunyanOptions signaleOptions
    log.welcome();
    log.start();
    log.args({ delimiter, endOptions });
    const taskCommandChosen =
      command === "backup"
        ? await execTaskBackup(endOptions, log)
        : command === "merge"
        ? await execTaskMerge(endOptions, log)
        : command === "presort"
        ? await execTaskPresort(endOptions, log)
        : command === "rename"
        ? await execTaskRename(endOptions, log)
        : throwNoCommandFound(command);
    log.saveLogFile();
    log.done();
  } catch (error) {
    console.error(error);
  }
}

function throwNoCommandFound(command) {
  throw new Error(`Not found this '${command}' command!`);
}

function runFromCli(args) {
  const cliCommand = args.input[0];
  const cliPositional = getPositional(args.input);
  const flags = args.flags;
  const command = Object.assign({}, { command: cliCommand }, flags, {
    positional: cliPositional
  });
  if (cliCommand === undefined) {
    args.showHelp();
  } else {
    runThis(command);
  }
}

function getPositional(input) {
  const positional = input.slice(1);
  return positional.length == 0 ? undefined : positional;
}

module.exports = {
  runFromCli,
  runThis
};
