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
//[sindresorhus/pretty-bytes: Convert bytes to a human readable string: 1337 → 1.34 kB](https://github.com/sindresorhus/pretty-bytes)

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
    //generic
    done: done_4l(msger, logger),
    msg: msg_4l(msger, logger),
    welcome: welcome_4l(msger, logger),
    args: args_4l(msger, logger),
    argsTask: argsTask_4l(msger, logger),
    start: start_4l(msger, logger),
    startTask: startTask_4l(msger, logger),
    inputDir: inputDir_4l(msger, logger),
    numberFiles: numberFiles_4l(msger, logger),
    dryRun: dryRun_4l(msger, logger),
    //backup task
    outputForBackup: outputForBackup_4l(msger, logger),
    startZipping: startZipping_4l(msger, logger),
    endZipping: endZipping_4l(logger), //interactive signale uses startZipping msger
    showZipSize: showZipSize_4l(msger, logger),
    checkZipArchive: checkZipArchive_4l(msger, logger),
    checkStdoutLogs: checkStdoutLogs_4l(msger, logger),
    //presort taks
    outputDirForMove: outputDirForMove_4l(msger, logger),
    renamedFiles: renamedFiles_4l(msger, logger),
    //rename task
    excludedDirs: excludedDirs_4l(msger, logger),
    renameInPlace: renameInPlace_4l(msger, logger)
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
function done_4l(msger, logger) {
  return () => {
    msger.success(colorWith("green")(doneMsg));
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
function welcome_4l(msger) {
  return () => {
    msger.log("Welcome to:");
    putBanner(
      msger,
      colorWith("green")(`\n ${figlet.textSync("photo-mgmt", "Stampate")}`)
    );
    putBanner(
      msger,
      colorWith("gray")("                v.2 - by qaraluch (2018)")
    );
    putSpaces(msger, 1);
  };
}

// ------------------------------------ MSG: args
function args_4l(msger, logger) {
  return args => {
    logger.info(
      args,
      "Resolved arguments passed to script from cli and config."
    );
  };
}

// ------------------------------------ MSG: args - task
function argsTask_4l(msger, logger) {
  return (task, args) => {
    logger.info({ taskArgs: args }, "Used arguments by task: %s", task);
  };
}

// ------------------------------------ MSG: start
function start_4l(msger, logger) {
  return () => {
    logger.info("Started script!");
  };
}

// ------------------------------------ MSG: start - task
function startTask_4l(msger, logger) {
  return command => {
    msger.start(`Task: ${colorWith("yellow")(command)}`);
    logger.info("Started photo-mgmt task: %s", command);
  };
}

// ------------------------------------ MSG: input dir
function inputDir_4l(msger, logger) {
  return (path, commandName) => {
    msger.log(`${addTab()}... reading files in dir: ${path}`);
    logger.info(
      `Will read files for ${commandName} in dir (inputPath): ${path}`
    );
  };
}

// ------------------------------------ MSG: number files
function numberFiles_4l(msger) {
  return number => {
    msger.log(`${addTab()}... read: ${colorWith("yellow")(number)} files`);
  };
}

// ------------------------------------ MSG: output - backup
function outputForBackup_4l(msger, logger) {
  return (path, zipName, fullPath) => {
    msger.log(`${addTab()}... save zip file in dir: ${path}`);
    msger.log(`${addTab()}... as file: ${zipName}`);
    logger.info("Will save zip files to file (backupFilePath): %s", fullPath);
  };
}

// ------------------------------------ MSG: start - zipping
function startZipping_4l(msger, logger) {
  return () => {
    //workaround:
    const oldScope = msger._scopeName;
    const nmsger = msger.scope(oldScope);
    nmsger._interactive = true;
    nmsger.log(`${addTab()}... zipping: ...`);
    logger.info("Started photo-mgmt backup zipping...");
    return nmsger;
  };
}

// ------------------------------------ MSG: end - zipping
function endZipping_4l(logger) {
  return imsger => {
    //workaround:
    imsger.log(`${addTab()}... zipping: DONE!`);
    logger.info("End zipping...");
  };
}

// ------------------------------------ MSG: show zip size
function showZipSize_4l(msger, logger) {
  return size => {
    const prettySize = prettyBytes(size);
    msger.log(`${addTab()}... zip size: ${prettySize}  `);
    logger.info({ zipSizeBytes: size }, "Zip size: %s", prettySize);
  };
}

// ------------------------------------ MSG: check zip file
function checkZipArchive_4l(msger, logger) {
  return () => {
    msger.info("... checking zip file");
    logger.info("Checking zip file was performed");
  };
}

// ------------------------------------ MSG: check zip logs
function checkStdoutLogs_4l(msger, logger) {
  return stdout => {
    const split = stdout.split("\n");
    const cut = split.slice(-3, split.length);
    msger.log(`${addTab()}    (...)`);
    cut.forEach(line => msger.log(`${addTab()}    - ${line}`));
    logger.info({ checkZipLogs: split }, "Logs of zip archive checking");
  };
}

// ------------------------------------ MSG: output for move
function outputDirForMove_4l(msger, logger) {
  return outputPath => {
    msger.log(`${addTab()}... move files to dir: ${outputPath}`);
    logger.info("Moved files to dir (outputPath): %s", outputPath);
  };
}

// ------------------------------------ MSG: renamedFiles
function renamedFiles_4l(msger, logger) {
  return (renamedFiles, task) => {
    // <- renamed walkOutput arr of objects
    const pairs = renamedFiles.map(itm => ({
      old: itm.oldName,
      new: itm.newName
    }));
    const longestOldName = pairs.reduce(
      (acc, next) => (next.old.length > acc ? next.old.length : acc),
      0
    );
    const calcSpace = str => " ".repeat(longestOldName - str.length);
    msger.info("Renamed files:");
    pairs.forEach(pair =>
      msger.log(`   ${pair.old}${calcSpace(pair.old)} - ${pair.new}`)
    );
    logger.info({ presortRename: pairs }, `Renamed files by ${task} script`);
  };
}

// ------------------------------------ MSG: dry run
function dryRun_4l(msger, logger) {
  return () => {
    msger.warn(
      `In ${colorWith("yellow")(
        "dry run"
      )} mode. All operations on filesystem turned off`
    );
    logger.warn("Dry run mode on.");
  };
}

// ------------------------------------ MSG: excluded dir
function excludedDirs_4l(msger, logger) {
  return (excludedDirs, parsedExcludedDirs) => {
    msger.log(
      `${addTab()}... those dirs will be excluded from rename task: ${excludedDirs}`
    );
    logger.info(
      { parsedExcludedDirs: parsedExcludedDirs },
      "Exclude dirs from rename task (excludedDirs): %s",
      excludedDirs
    );
  };
}

// ------------------------------------ MSG: rename in place
function renameInPlace_4l(msger, logger) {
  return () => {
    msger.log(`${addTab()}... renamed files in place.`);
  };
}

module.exports = {
  initLogger,
  initUiLogger
};
