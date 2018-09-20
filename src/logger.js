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
    start: start_4l(msger, logger)
  };
}

// Messages helpers
const colorWith = color => msg => `${chalk[color](msg)}`;
const delimitWith = delimiter => msg => `${delimiter}${msg}`;
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
    putSpaces(msger, 1);
    msger.log(welcomeTxt);
    putBanner(msger, colorWith(welcomeColor)(welcomeMgs));
    putBanner(msger, colorWith("gray")(authorTxt));
  };
}

// ------------------------------------ MSG: args
const argsMsg =
  "Resolved arguments passed to script from cli, manualrun or config.";

function args_4l(msger, logger) {
  return args => {
    logger.info(args, argsMsg);
  };
}

// ------------------------------------ MSG: start
const startMsg = "Started script!";

function start_4l(msger, logger) {
  return () => {
    logger.info(startMsg);
  };
}

module.exports = {
  initLogger,
  initUiLogger
};
