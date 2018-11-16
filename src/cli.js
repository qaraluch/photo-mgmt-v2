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
    photo-mgmt <command> --flag <value> 
    
    <command> - available task commands:
      - backup
      - presort
      - rename
      - merge
    
  1. Backup
     Simply zip up photos for temporary backup. Automatically performs 
     simple zip archive check.

      Examples:
        photo-mgmt backup
        photo-mgmt backup --config dev --no-check-archive
        photo-mgmt backup -c dev-rename
        photo-mgmt backup --prefix-archive-name my-name
        photo-mgmt backup --prefix-archive-name # get current dir name as prefix
        photo-mgmt backup --input-dir "./test/fixtures/cu"
        photo-mgmt backup -i "./test/fixtures/cu"
        photo-mgmt backup -i #archive content of cwd 
        photo-mgmt backup --output-dir "./test/fixtures/custom-cu-presort"
        photo-mgmt backup -o "./test/fixtures/custom-cu-presort"
        photo-mgmt backup -o #save archive file in cwd
      
  2. Presort
     This task normalize a photo file names to format as this 
     '2018-08-17 11.11.43-0.jpg' example. For media files like: .jpg, 
     .mp4 tries to get date information from EXIF meta data. In case files: 
     .gif and .png files script get creation time to rename process.

      Examples:
        photo-mgmt presort
        photo-mgmt presort --dry-run
        photo-mgmt presort -d
        photo-mgmt presort --input-dir "./test/fixtures/cu"
        photo-mgmt presort -i "./test/fixtures/cu"
        photo-mgmt presort -i #presort in cwd 
        photo-mgmt presort --output-dir "./test/fixtures/custom-cu-presort"
        photo-mgmt presort -o "./test/fixtures/custom-cu-presort"
        photo-mgmt presort -o #presort to temporary dir in cwd

  3. Rename
     This task is meant to run after 'presort' script but it can perform basic 
     normalize of photo names too. Main purpose of this task is to add descriptions 
     (tag) to photo names. It can also add tag after parent dir name. 

      Examples:
        photo-mgmt rename -c dev-rename --tag myDir
        photo-mgmt rename -c dev-rename -t myDir
        photo-mgmt rename -c dev-rename --rename-after-parent-dir
        photo-mgmt rename -c dev-rename -r
        photo-mgmt rename -c dev-rename --input-dir "./test/fixtures/cu-presort-rename/some-dir/"
        photo-mgmt rename -c dev-rename -i "./test/fixtures/cu-presort-rename/some-dir/"
        photo-mgmt rename -c dev-rename -i #rename in cwd 
        photo-mgmt rename -c dev-rename --exclude-dirs "some-dir"
        photo-mgmt rename -c dev-rename -e "some-dir"

  4. Merge
     This task movies photos (only ones with proper name) into common dir. When there are
     photos with the same name, the task script bumps up the version part of the name of one of them. 

      Examples:
        photo-mgmt merge --output-dir "./test/fixtures/merge/merged2"
        photo-mgmt merge -o "./test/fixtures/merge/merged2"
        photo-mgmt merge -o #merge to temporary dir in cwd
        photo-mgmt merge ./test/fixtures/merge/merge-b ./test/fixtures/merge/merge-c
      

  Options:
    -c, --config [name]             Pass in config name that specifies I/O dirs. See configs.
                                    When no [name] variable is passed then default value is taken.
                                    Default: dev (perform operations on test fixtures).

    --check-archive                 Perform backup task archive test.
                                    Default: yes.

    --prefix-archive-name [name]    Changes prefix of archive file name.
                                    When no [name] variable is passed then current
                                    dir name becomes a prefix string.
                                    Default: "cu-temp-arch".

    -d, --dry-run                   Dry run. Disable all operations on files. 
                                    Apples only to presort, merge and rename tasks.  
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

    -s, --silent                    Disable all log messages in console.
                                    Default: no.

    -l, --disable-file-logs         Disable output of detailed log of tasks to file.
                                    Default: no.

    --log-file-prefix [string]      Define custom prefix of log file.
                                    Default: 'log-photo-mgmt-<task>'.

    --log-output-dir [path]         Define log files saving directory. 
                                    Default: current working directory.

  Proper photo format: <year>-<month>-<day> <hour>.<minute>.<seconde>-<version> - <tag> - <description>

  Global options (overrides above)
    --help 
    --version
`,
  options
);

runFromCli(args);
