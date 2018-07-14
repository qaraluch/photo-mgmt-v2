const test = require("ava");
const path = require("path");
const R = require("ramda");

const { doRenameFiles } = require("../src/rename.js");
const { getAllFiles } = require("../src/walker.js");

const cwd = process.cwd();
const cu = path.join(cwd, "/test/fixtures/cu");

let walkOutput, renamedFiles;

const getPropertyOf = (property, collection) =>
  R.map(item => item[property], collection);

const getPropertyOfCurried = R.curry(getPropertyOf);

const getNewExtensions = getPropertyOfCurried("newExt");
const getVersion = getPropertyOfCurried("version");
const getNewName = getPropertyOfCurried("newName");

test.before(async () => {
  walkOutput = await getAllFiles(cu);
  renamedFiles = await doRenameFiles(walkOutput);
});

test("rename - is function", t => {
  const msg = "should be a function";
  const actual = typeof doRenameFiles === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename - extension to lower case", t => {
  const msg = "should return all extension as lower case letters";
  const newExt = getNewExtensions(renamedFiles);
  const check = R.map(item => item === item.toLowerCase(), newExt);
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename - transform long jpeg extension to short", t => {
  const msg = "should return all .jpeg extension as .jpg";
  const onlyJpegs = renamedFiles.filter(
    item => path.parse(item.oldName).ext === ".jpeg"
  );
  const newExt = getNewExtensions(onlyJpegs);
  const check = R.map(item => item === ".jpg", newExt);
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename - get versions", t => {
  const msg = "should return all new names with version number";
  const versions = getVersion(renamedFiles);
  const check = R.map(item => item && true, versions);
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename - do not rename when no date in the file name", t => {
  const msg = "should return only files with parsable date";
  const onlyFilesWithNoDate = renamedFiles.filter(
    item => (item.date ? false : true)
  );
  const check = R.map(
    item => item.oldName === item.newName,
    onlyFilesWithNoDate
  );
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename - after exif / stats", t => {
  const msg =
    "should rename files after exif or stats info when no date in the filename";
  const onlyFilesWithNoDate = renamedFiles.filter(
    item => (item.date ? false : true)
  );
  const check = R.map(item => (item.date ? true : false), onlyFilesWithNoDate);
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename - no duplicate renamed names", t => {
  const msg = "should return all unique new names";
  const newNames = getNewName(renamedFiles);
  // console.log("newNames ", newNames);
  const findUnique = (acc, next) => {
    acc.includes(next) || acc.push(next);
    return acc;
  };
  const uniques = R.reduce(findUnique, [], newNames);
  const actual = newNames.length;
  const expected = uniques.length;
  t.is(actual, expected, msg);
});
