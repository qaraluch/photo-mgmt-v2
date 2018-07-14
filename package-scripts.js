const { series, concurrent, rimraf } = require("nps-utils");

const cleanNodeModules = rimraf("node_modules");

module.exports = {
  scripts: {
    default: "node src/index.js",
    run: {
      script: "nps test.resetFixtures && node src/index.js"
    },
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
      },
      resetFixtures: {
        description: "reset photos/film fixtures",
        script:
          "rm -rf ./test/fixtures/cu ./test/fixtures/cu-backup ./test/fixtures/cu-sort && cp -rf ./test/fixtures/cu-org/ ./test/fixtures/cu"
      }
    }
  },
  options: {
    silent: false
  }
};
