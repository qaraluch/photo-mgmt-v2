const { series, concurrent, rimraf } = require("nps-utils");

const cleanNodeModules = rimraf("node_modules");

module.exports = {
  scripts: {
    default: "node run.js",
    debug: {
      default: {
        description: "Run node.js debug",
        script: "node --inspect-brk run.js"
      }
    },
    clear: {
      default: {
        description: "Deletes the `node_modules` directory",
        script: series(cleanNodeModules)
      }
    },
    reset: {
      default: {
        description: "Reset all fixtures.",
        script: concurrent.nps(
          "test.resetFixturesForCU",
          "test.resetFixturesForRename",
          "test.resetFixturesForMerge",
          "logs"
        )
      }
    },
    logs: {
      default: {
        description: "Remove all test logs.",
        script: "rm -rf ./test/fixtures/logs"
      }
    },
    test: {
      default: {
        description: "ava test",
        script: "ava --verbose"
      },
      resetFixturesForMerge: {
        description: "reset photos/film fixtures in merge task",
        script:
          "rm -rf ./test/fixtures/merge && cp -rf ./test/fixtures/merge-org/ ./test/fixtures/merge"
      },
      resetFixturesForCU: {
        description: "reset photos/film fixtures",
        script:
          "rm -rf ./test/fixtures/cu ./test/fixtures/cu-backup ./test/fixtures/cu-presort ./test/fixtures/custom-cu-presort && cp -rf ./test/fixtures/cu-org/ ./test/fixtures/cu"
      },
      resetFixturesForRename: {
        description: "reset photos/film fixtures for rename task",
        script:
          "rm -rf ./test/fixtures/cu-presort-rename && mkdir -p ./test/fixtures/cu-presort-rename/some-dir && cp -rf ./test/fixtures/cu-org/*2017*.* ./test/fixtures/cu-presort-rename/some-dir && cp -rf ./test/fixtures/cu-org/*.mp4 ./test/fixtures/cu-presort-rename/"
      }
    }
  },
  options: {
    silent: false
  }
};
