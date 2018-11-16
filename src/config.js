const { resolveOptions } = require("./utils.js");

const appOptions = {
  cwd: process.cwd(),
  delimiter: "photo-mgmt",
  config: "dev",
  dryRun: false,
  silent: false,
  disableFileLogs: false,
  logFilePrefix: undefined, // set in resolveAllOptions fn
  logOutputDir: "."
};

const predefinedPathOptions = {
  cu: undefined,
  cuBackup: undefined,
  cuPresort: undefined,
  mergeDirName: undefined,
  mergeDirsInput: undefined
};

const cliOptions = {
  inputDir: undefined,
  outputDir: undefined,
  positional: undefined
};

const taskDefaultOptions = {
  prefixArchiveName: "backup",
  checkArchive: true,
  tag: undefined,
  renameAfterParentDir: false,
  excludeDirs: undefined
};

function resolveAllOptions(args) {
  const { command, config } = args;
  const configChosen = chooseConfig(config);
  const endOptions = resolveOptions(
    {},
    appOptions,
    { logFilePrefix: `log-${appOptions.delimiter}-${command}` },
    predefinedPathOptions,
    taskDefaultOptions,
    configChosen,
    cliOptions,
    args
  );
  return endOptions;
}

function chooseConfig(configName) {
  const chosen =
    configName === "dev"
      ? configDev
      : configName === "dev-rename"
        ? configDevRename
        : configDev;
  return chosen;
}

const configDev = {
  logOutputDir: "./test/fixtures/logs",
  cu: "./test/fixtures/cu/",
  cuBackup: "./test/fixtures/cu-backup/",
  cuPresort: "./test/fixtures/cu-presort/",
  mergedDirName: "./test/fixtures/merge/merged",
  mergeDirsInput: [
    "./test/fixtures/merge/merge-a/",
    "./test/fixtures/merge/merge-b/"
  ]
};

const configDevRename = {
  logOutputDir: "./test/fixtures/logs",
  cu: "./test/fixtures/cu/",
  cuBackup: "./test/fixtures/cu-backup/",
  cuPresort: "./test/fixtures/cu-presort-rename/"
};

module.exports = resolveAllOptions;
