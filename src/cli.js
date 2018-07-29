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
    dryrun: {
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
        photo-mgmt backup --config configCU
        photo-mgmt backup --config configTest --no-check-archive
      
  Options:
    -c, --config=<name>     Pass in config name that specifies I/O dirs. See configs.
                            Default: (...).

    --check-archive         Perform backup task archive test.
                            Default: yes.



    --dryrun                Dry run. Disable all operations on files. 

    Negate flags by using the --no- prefix.

  Global options (overrides above)
    --help 
    --version
`,
  options
);

runFromCli(args);
