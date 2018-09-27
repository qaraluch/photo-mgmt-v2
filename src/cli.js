#!/usr/bin/env node
const { runFromCli } = require("./index.js");
const meow = require("meow");
//[sindresorhus/meow: CLI app helper](https://github.com/sindresorhus/meow)

const options = {
  flags: {
    checkArchive: {
      type: "boolean",
      default: true // have to be here in order to work --no-check-archive
    },
    prefixArchiveName: {
      type: "string",
      default: undefined
    },
    config: {
      type: "string",
      alias: "c",
      default: undefined
    },
    tag: {
      type: "string",
      alias: "t",
      default: undefined
    },
    renameAfterParentDir: {
      type: "boolean",
      alias: "r",
      default: undefined
    },
    inputDir: {
      type: "string",
      alias: "i",
      default: undefined
    },
    outputDir: {
      type: "string",
      alias: "o",
      default: undefined
    },
    excludeDirs: {
      type: "string",
      alias: "e",
      default: undefined
    },
    dryRun: {
      type: "boolean",
      alias: "d",
      default: undefined
    },
    silent: {
      type: "boolean",
      alias: "s",
      default: undefined
    },
    disableFileLogs: {
      type: "boolean",
      alias: "l",
      default: undefined
    },
    logFilePrefix: {
      type: "string",
      default: undefined
    },
    logOutputDir: {
      type: "string",
      default: undefined
    }
  }
};

const args = meow(
  `
  photo-mgmt v2

  Personal photo management scripts.
  
	Usage:
    photo-mgmt <command> --flag=<input> 
    
    <command> - available task commands:
      - backup
      - presort
      - rename
    
  1. Backup
     (Info...)

      Examples:
        photo-mgmt backup
        photo-mgmt backup -c configCU
        photo-mgmt backup --config configTest --no-check-archive
        photo-mgmt backup --prefix-archive-name # get current dir name as prefix
        photo-mgmt backup --prefix-archive-name my-name
        photo-mgmt backup -i "./test/fixtures/cu"
        photo-mgmt backup -i #archive content of cwd 
        photo-mgmt backup --output-dir "./test/fixtures/custom-cu-presort"
        photo-mgmt backup -o "./test/fixtures/custom-cu-presort"
        photo-mgmt backup -o #save archive file in cwd
      
  2. Presort
     (Info...)

      Examples:
        photo-mgmt presort
        photo-mgmt presort --config configTest --dry-run
        photo-mgmt presort -c configCU -d
        photo-mgmt presort --input-dir "./test/fixtures/cu"
        photo-mgmt presort -i "./test/fixtures/cu"
        photo-mgmt presort -i #presort in cwd 
        photo-mgmt presort --output-dir "./test/fixtures/custom-cu-presort"
        photo-mgmt presort -o "./test/fixtures/custom-cu-presort"
        photo-mgmt presort -o #presort to temporary dir in cwd

  3. Rename
     (Info...)

      Examples:
        photo-mgmt rename -c configTestRename --tag myDir
        photo-mgmt rename -c configTestRename -dt myDir
        photo-mgmt rename -c configTestRename --rename-after-parent-dir
        photo-mgmt rename -c configTestRename -r
        photo-mgmt rename -c configTestRename --input-dir "./test/fixtures/cu-presort-rename/some-dir/"
        photo-mgmt rename -c configTestRename -i "./test/fixtures/cu-presort-rename/some-dir/"
        photo-mgmt rename -c configTestRename -i #rename in cwd 
        photo-mgmt rename -c configTestRename --exclude-dirs "some-dir"
        photo-mgmt rename -c configTestRename -e "some-dir"

  Options:
    -c, --config [name]             Pass in config name that specifies I/O dirs. See configs.
                                    When no [name] variable is passed then (...)
                                    Default: (...).

    --check-archive                 Perform backup task archive test.
                                    Default: yes.

    --prefix-archive-name [name]    Changes prefix of archive file name.
                                    When no [name] variable is passed then current
                                    dir name becomes a prefix string.
                                    Default: "cu-temp-arch".

    -d, --dry-run                   Dry run. Disable all operations on files. 
                                    Apples only to presort and rename tasks.  
                                    Default: no.

    -t, --tag <name>                When perform rename task it adds tag to filename.
                                    Default: undefined.

    -r, --rename-after-parent-dir   Options adds tag as parent dir name while rename task is performed.
                                    It takes precedence over --tag option.
                                    Default: no.

    -i, --input-dir [path]          Specifies custom base dir for tasks.
                                    When flag is passed without value then tasks is performed on cwd dir.
                                    Default: undefined.

    -o, --output-dir [path]         Specifies custom output dir for tasks.
                                    When flag is passed without value then task outputs in temporary dir in cwd.
                                    (e.i.: ./temp-cu-presort-<times-stamp> )
                                    For backup task option without value results in saving the archive in cwd.
                                    Default: undefined.

    -e, --exclude-dirs <string>     Pass coma separated string with list of dirs to exclude for rename task.
                                    Default: undefined.

    -s, --silent                    Disable all log mesagges in console.
                                    Default: no.

    -l, --disable-file-logs         Disable output of detailed log of tasks to file.
                                    Default: no.

    --log-file-prefix [string]      Define custom prefix of log file.
                                    Default: 'log-photo-mgmt-<command>'.

    --log-output-dir [path]         Define log files saving directory. 
                                    Default: current working directory.

  Global options (overrides above)
    --help 
    --version
`,
  options
);

runFromCli(args);
