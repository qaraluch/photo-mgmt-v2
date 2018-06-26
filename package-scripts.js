const { series, concurrent, rimraf } = require("nps-utils");

const cleanNodeModules = rimraf("node_modules");

module.exports = {
  scripts: {
    default: "node src/index.js",
    clear: {
      default: {
        description: "Deletes the `node_modules` directory",
        script: series(cleanNodeModules)
      }
    },
    test: {
      default: {
        description: "ava test",
        script: "ava --verbose"
      }
    }
  },
  options: {
    silent: false
  }
};
