const path = require("path");
// const R = require("ramda");

const figlet = require("figlet");
// [patorjk/figlet.js](https://github.com/patorjk/figlet.js)

const chalk = require("chalk");
//[chalk/chalk: 🖍 Terminal string styling done right](https://github.com/chalk/chalk#256-and-truecolor-color-support)

const { Signale } = require("signale");
//[klauscfhq/signale: 👋 Hackable console logger](https://github.com/klauscfhq/signale)

const bunyan = require("bunyan");
//[trentm/node-bunyan: a simple and fast JSON logging module for node.js services](https://github.com/trentm/node-bunyan)

const makeDir = require("make-dir");
//[sindresorhus/make-dir: Make a directory and its parents if needed - Think `mkdir -p`](https://github.com/sindresorhus/make-dir)

const prettyBytes = require("pretty-bytes");

const { getFileTimeStamp } = require("./utils.js");

const defaultLogOptions = {
  silent: false,
  delimiter: "",
  disableFileLogs: false,
  logOutputDir: ".",
  logFilePrefix: "logs" // rest of file name will be -<time-stamp>.log
};

// Logging Utils
const resolveDelimiter = delimiter => delimiter || "unknown";

const resolveLogOutputPath = (logOutputDir, logFilePrefix) =>
  path.resolve(logOutputDir, `${logFilePrefix}-${getFileTimeStamp()}.log`);

const fileStream = logFilePath => [{ path: logFilePath }];

const setUpStream = (disableFileLogs, logOutputDir, logFilePrefix) => {
  if (disableFileLogs) {
    return [];
  } else {
    return fileStream(resolveLogOutputPath(logOutputDir, logFilePrefix));
  }
};

function resolveOptions(initOptions) {
  const {
    logOptions = {},
    signaleOptions = {},
    bunyanOptions = {}
  } = initOptions;
  const logEndOptions = Object.assign(
    Object.create(null),
    defaultLogOptions,
    logOptions
  );
  const {
    delimiter,
    silent,
    disableFileLogs,
    logOutputDir,
    logFilePrefix
  } = logEndOptions;
  const endOptions = Object.assign(
    Object.create(null),
    logEndOptions,
    {
      scope: delimiter,
      disabled: silent
    },
    signaleOptions,
    {
      name: resolveDelimiter(delimiter),
      streams: setUpStream(disableFileLogs, logOutputDir, logFilePrefix),
      level: "trace"
    },
    bunyanOptions
  );
  return endOptions;
}

// Signale logger
function initUiLogger(initOptions = {}) {
  const options = resolveOptions(initOptions);
  const msger = new Signale(options);
  return {
    msg: msg_4ui(msger)
  };
}

// Bunyan Logger
async function initLogger(initOptions = {}) {
  const options = resolveOptions(initOptions);
  const { level, logOutputDir } = options;
  try {
    await makeDir(logOutputDir);
  } catch (error) {
    throw new Error(
      `While init logger: making dir for log files occurs error: ${error}`
    );
  }
  const msger = new Signale(options);
  const logger = bunyan.createLogger(options); //not known internal bunyan disable option
  const ringbuffer = new bunyan.RingBuffer({ limit: 10000000 });
  logger.addStream({
    type: "raw",
    stream: ringbuffer,
    level: level
  });
  const returnRingbuffer = reducerCb => {
    const rec = ringbuffer.records;
    if (typeof reducerCb === "function") {
      return rec.reduce(reducerCb, []);
    } else {
      return rec;
    }
  };
  return {
    _returnLogs: returnRingbuffer,
    done: done_4l(msger, logger),
    msg: msg_4l(msger, logger),
    welcome: welcome_4l(msger, logger),
    args: args_4l(msger, logger),
    argsTask: argsTask_4l(msger, logger),
    start: start_4l(msger, logger),
    startTask: startTask_4l(msger, logger),
    inputForBackup: inputForBackup_4l(msger, logger),
    numberFiles: numberFiles_4l(msger, logger),
    outputForBackup: outputForBackup_4l(msger, logger),
    startZipping: startZipping_4l(msger, logger),
    endZipping: endZipping_4l(logger), //interactive signale uses startZipping msger
    showZipSize: showZipSize_4l(msger, logger)
  };
}

// Messages helpers
const colorWith = color => msg => `${chalk[color](msg)}`;
const delimitWith = delimiter => msg => `${delimiter}${msg}`;
const addTab = () => " ".repeat(13);
const configSignaleNoDecorations = {
  displayLabel: false,
  displayBadge: false,
  displayScope: false,
  types: {
    space: {
      badge: null,
      color: null,
      label: null
    }
  }
};
const putSpaces = (msger, spaces = 1) => {
  const nMsger = msger.scope("");
  nMsger.config(configSignaleNoDecorations);
  nMsger.log("\n".repeat(spaces));
};
const putBanner = (msger, banner) => {
  const nMsger = msger.scope("");
  nMsger.config(configSignaleNoDecorations);
  nMsger.log(banner);
};

// ------------------------------------ MSG: done
const doneMsg = "DONE!";
const doneColor = "green";
function done_4l(msger, logger) {
  return () => {
    msger.success(colorWith(doneColor)(doneMsg));
    logger.info(doneMsg);
  };
}

// ------------------------------------ MSG: msg
function msg_4ui(msger) {
  return msg => msger.log(msg);
}
function msg_4l(msger, logger) {
  return msg => {
    msger.log(msg);
    logger.info(msg);
  };
}

// ------------------------------------ MSG: welcome
const bannerTxt = "photo-mgmt";
const welcomeTxt = "Welcome to:";
const welcomeMgs = `\n ${figlet.textSync(bannerTxt, "Stampate")}`;
const authorTxt = "                v.2 - by qaraluch (2018)";
const welcomeColor = "green";
function welcome_4l(msger) {
  return () => {
    msger.log(welcomeTxt);
    putBanner(msger, colorWith(welcomeColor)(welcomeMgs));
    putBanner(msger, colorWith("gray")(authorTxt));
    putSpaces(msger, 1);
  };
}

// ------------------------------------ MSG: args
const argsMsg = "Resolved arguments passed to script from cli and config.";
function args_4l(msger, logger) {
  return args => {
    logger.info(args, argsMsg);
  };
}

// ------------------------------------ MSG: args - task
const argsTaskMsg = "Used arguments by task: %s";
function argsTask_4l(msger, logger) {
  return (task, args) => {
    logger.info({ taskArgs: args }, argsTaskMsg, task);
  };
}

// ------------------------------------ MSG: start
const startMsg = "Started script!";
function start_4l(msger, logger) {
  return () => {
    logger.info(startMsg);
  };
}

// ------------------------------------ MSG: start - task
const startTaskMsg = "Started photo-mgmt task: %s";
const startTaskColor = "yellow";
function startTask_4l(msger, logger) {
  return command => {
    msger.start(`Task: ${colorWith(startTaskColor)(command)}`);
    logger.info(startTaskMsg, command);
  };
}

// ------------------------------------ MSG: input - backup
const inputBackupMsg = "Will read files for backup in dir (inputPath): %s";
function inputForBackup_4l(msger, logger) {
  return path => {
    msger.log(`${addTab()}... reading files in dir: ${path}`);
    logger.info(inputBackupMsg, path);
  };
}

// ------------------------------------ MSG: number files
const numberFilesColor = "yellow";
function numberFiles_4l(msger, logger) {
  return number => {
    msger.log(
      `${addTab()}... read: ${colorWith(numberFilesColor)(number)} files`
    );
  };
}

// ------------------------------------ MSG: output - backup
const outputBackupMsg = "Will save zip files to file (backupFilePath): %s";
function outputForBackup_4l(msger, logger) {
  return (path, zipName, fullPath) => {
    msger.log(`${addTab()}... save zip file in dir: ${path}`);
    msger.log(`${addTab()}... as file: ${zipName}`);
    logger.info(outputBackupMsg, fullPath);
  };
}

// ------------------------------------ MSG: start - zipping
const startZippingTaskMsg = "Started photo-mgmt backup zipping...";
// const startZippingTaskColor = "yellow";
function startZipping_4l(msger, logger) {
  return () => {
    //workaround:
    const oldScope = msger._scopeName;
    const nmsger = msger.scope(oldScope);
    nmsger._interactive = true;
    nmsger.log(`${addTab()}... zipping: ...`);
    logger.info(startZippingTaskMsg);
    return nmsger;
  };
}

// ------------------------------------ MSG: end - zipping
const endZippingTaskMsg = "End zipping...";
function endZipping_4l(logger) {
  return imsger => {
    //workaround:
    imsger.log(`${addTab()}... zipping: DONE!`);
    logger.info(endZippingTaskMsg);
  };
}

// ------------------------------------ MSG: show zip size
const showZipSizeMsg = "Zip size: %s";
function showZipSize_4l(msger, logger) {
  return rawZipStdout => {
    // raw: 119874223 total bytes\n
    const size = parseInt(rawZipStdout[0].split(" ")[0]);
    const prettySize = prettyBytes(size);
    msger.log(`${addTab()}... zip size: ${prettySize}  `);
    logger.info({ zipSizeBytes: size }, showZipSizeMsg, prettySize);
  };
}

module.exports = {
  initLogger,
  initUiLogger
};
