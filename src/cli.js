#!/usr/bin/env node
const meow = require("meow");
//[sindresorhus/meow: CLI app helper](https://github.com/sindresorhus/meow)

const options = {
  flags: {
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

  ...
  
	Usage
    yt-info <id> --output <path> 
    
    <id> of YT playlist  
    
  Examples:
	  yt-info PLwJS-...X0 --output /mnt/g/file.json --doubleSave
    
	Options
    -o, --output=<path>     Pass in output path. Results are written to the file.
                            Otherwise data is saved in currwnt working directory. 
    --dryrun                Dry run. Disable all operations on files. 

  Global options (overrides above)
    --help 
    --version
`,
  options
);

console.log("-->", args.input);
console.log("-->", args.flags);
// runCommand(args);
