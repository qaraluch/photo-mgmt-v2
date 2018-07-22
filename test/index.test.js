const test = require("ava");
const path = require("path");
const R = require("ramda");

const { doRenameFilesForPresort, addTag } = require("../src/rename.js");
const { getAllFiles } = require("../src/walker.js");

const cwd = process.cwd();
const cu = path.join(cwd, "/test/fixtures/cu");

let walkOutput, renamedFiles, renamedFilesForRenameTag;

const getPropertyOf = (property, collection) =>
  R.map(item => item[property], collection);

const getPropertyOfCurried = R.curry(getPropertyOf);

const getNewExtensions = getPropertyOfCurried("newExt");
const getVersion = getPropertyOfCurried("version");
const getNewName = getPropertyOfCurried("newName");
const getItemByOldName = name => results =>
  results.filter(item => item.oldName === name);

const tagForRename = "myTag";

test.before(async () => {
  walkOutput = await getAllFiles(cu);
  renamedFiles = await doRenameFilesForPresort(walkOutput);
  renamedFilesForRenameTag = await addTag(walkOutput, tagForRename);
});

test("rename for presort - is function", t => {
  const msg = "should be a function";
  const actual = typeof doRenameFilesForPresort === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename for presort - extension to lower case", t => {
  const msg = "should return all extension as lower case letters";
  const newExt = getNewExtensions(renamedFiles);
  const check = R.map(item => item === item.toLowerCase(), newExt);
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename for presort - transform long jpeg extension to short", t => {
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

test("rename for presort - get versions", t => {
  const msg = "should return all new names with version number";
  const versions = getVersion(renamedFiles);
  const check = R.map(item => item && true, versions);
  const actual = R.all(Boolean, check);
  const expected = true;
  t.is(actual, expected, msg);
});

test("rename for presort - do not rename when no date in the file name", t => {
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

test("rename for presort - after exif / stats", t => {
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

test("rename for presort - no duplicate renamed names", t => {
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

test("rename tag - files with date", t => {
  const msg =
    "should rename files that tag is placed between date and old comment";
  const inputName = "2017-09-19 22.22.22-1 - proper one.jpg";
  const renamedName = `2017-09-19 22.22.22-1 - ${tagForRename} - proper one.jpg`;
  const [foundItem] = getItemByOldName(inputName)(renamedFilesForRenameTag);
  const actual = foundItem.newName;
  const expected = renamedName;
  t.is(actual, expected, msg);
});

test("rename tag - files without date", t => {
  const msg = "should rename files that tag is placed in the beginning";
  const inputName = "game-monument-valley.png";
  const renamedName = `${tagForRename} - game-monument-valley.png`;
  const [foundItem] = getItemByOldName(inputName)(renamedFilesForRenameTag);
  const actual = foundItem.newName;
  const expected = renamedName;
  t.is(actual, expected, msg);
});
