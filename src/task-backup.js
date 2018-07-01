const walk = require("qm-walk");

async function runTaskBackup(args) {
  const { cu: cuDir } = args;
  const cuPaths = await getAllCuFiles(cuDir);
  cuPaths.forEach(item => {
    console.log("-->", item.name);
  });
}

async function getAllCuFiles(scanPath) {
  const walkOutputExt = await walk({ path: scanPath });
  const paths = walkOutputExt.getExtendedInfo().result;
  return paths;
}

module.exports = runTaskBackup;
