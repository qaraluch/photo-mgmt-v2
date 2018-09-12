#!/usr/bin/env node
const { runFromCli } = require("./index.js");
const meow = require("meow");
//[sindresorhus/meow: CLI app helper](https://github.com/sindresorhus/meow)

const options = {
  flags: {
    checkArchive: {
      type: "boolean",
      default: true
    },
    config: {
      type: "string",
      alias: "c",
      default: "configTest"
    },
    tag: {
      type: "string",
      alias: "t",
      default: undefined
    },
    renameAfterParentDir: {
      type: "boolean",
      alias: "r",
      default: false
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
      default: false
    }
  }
};

const args = meow(
  `
  photoMgmt v.2

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
    -c, --config=<name>             Pass in config name that specifies I/O dirs. See configs.
                                    Default: (...).

    --check-archive                 Perform backup task archive test.
                                    Default: yes.

    -d, --dry-run                   Dry run. Disable all operations on files. 
                                    Apples only to presort and rename tasks.  
                                    Default: no.

    -t, --tag                       When perform rename task it adds tag to filename.
                                    Default: undefined.

    -r, --rename-after-parent-dir   Options adds tag as parent dir name while rename task is performed.
                                    It takes precedence over --tag option.
                                    Default: no.

    -i, --input-dir                 Specifies custom base dir for tasks.
                                    When flag is passed without value then tasks is performed on cwd dir.
                                    Default: undefined.

    -o, --output-dir                Specifies custom output dir for presort task.
                                    When flag is passed without value then task outputs in temporary dir in cwd.
                                    (e.i.: ./temp-cu-presort-<times-stamp> )
                                    Default: undefined.

    -e, --exclude-dirs              Pass coma separated string with list of dirs to exclude.
                                    Default: undefined.

    Negate flags by using the --no- prefix.

  Global options (overrides above)
    --help 
    --version
`,
  options
);

runFromCli(args);
