const test = require("ava");
const path = require("path");
const R = require("ramda");

const { doRenameFilesForPresort, addTag } = require("../src/rename.js");
const { getAllFiles } = require("../src/walker.js");

const cwd = process.cwd();
const cu = path.join(cwd, "/test/fixtures/cu");
const cuSortRename = path.join(cwd, "/test/fixtures/cu-sort-rename");

let walkOutput,
  walkOutputSortRename,
  renamedFiles,
  renamedFilesForRenameTag,
  renamedFilesForRenameTagAfterPD;

const getPropertyOf = (property, collection) =>
  R.map(item => item[property], collection);

const getPropertyOfCurried = R.curry(getPropertyOf);

const getNewExtensions = getPropertyOfCurried("newExt");
const getVersion = getPropertyOfCurried("version");
const getNewName = getPropertyOfCurried("newName");
const getItemByOldName = name => results =>
  results.filter(item => item.oldName === name);

const tagForRename = "myTag";
const renameAfterParentDir = true;

test.before(async () => {
  walkOutput = await getAllFiles(cu);
  walkOutputSortRename = await getAllFiles(cuSortRename);
  renamedFiles = await doRenameFilesForPresort(walkOutput);
  renamedFilesForRenameTag = await addTag(walkOutputSortRename, tagForRename);
  renamedFilesForRenameTagAfterPD = await addTag(
    walkOutputSortRename,
    tagForRename,
    renameAfterParentDir
  );
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
  const inputName = "no-film-file.mp4";
  const renamedName = `${tagForRename} - no-film-file.mp4`;
  const [foundItem] = getItemByOldName(inputName)(renamedFilesForRenameTag);
  const actual = foundItem.newName;
  const expected = renamedName;
  t.is(actual, expected, msg);
});

test("rename tag after dir - default", t => {
  const msg = "should rename files that tag is parent dir name";
  const inputName1 = "no-film-file.mp4";
  const renamedName1 = "cu-sort-rename - no-film-file.mp4";
  const [foundItem1] = getItemByOldName(inputName1)(
    renamedFilesForRenameTagAfterPD
  );
  const actual1 = foundItem1.newName;
  const expected1 = renamedName1;
  t.is(actual1, expected1, msg);
  const inputName2 = "2017-09-19 22.22.22-1 - proper one.jpg";
  const renamedName2 = "2017-09-19 22.22.22-1 - some-dir - proper one.jpg";
  const [foundItem2] = getItemByOldName(inputName2)(
    renamedFilesForRenameTagAfterPD
  );
  const actual2 = foundItem2.newName;
  const expected2 = renamedName2;
  t.is(actual2, expected2, msg);
});

test("rename tag after dir - only once", t => {
  const msg = "should rename files that tag is parent dir name only once";
  const inputName1 = "2017-09-19 11.11.11-1 - extraInfo - proper one.jpg";
  const renamedName1 =
    "2017-09-19 11.11.11-1 - some-dir - extraInfo - proper one.jpg";
  const [foundItem1] = getItemByOldName(inputName1)(
    renamedFilesForRenameTagAfterPD
  );
  const actual1 = foundItem1.newName;
  const expected1 = renamedName1;
  t.is(actual1, expected1, msg);
  const inputName2 = "2017-09-19 11.11.11-2 - some-dir - proper one.jpg";
  const renamedName2 = "2017-09-19 11.11.11-2 - some-dir - proper one.jpg";
  const [foundItem2] = getItemByOldName(inputName2)(
    renamedFilesForRenameTagAfterPD
  );
  const actual2 = foundItem2.newName;
  const expected2 = renamedName2;
  t.is(actual2, expected2, msg);
  const inputName3 =
    "2017-09-19 11.11.11-3 - some-dir - extraInfo - proper one.jpg";
  const renamedName3 =
    "2017-09-19 11.11.11-3 - some-dir - extraInfo - proper one.jpg";
  const [foundItem3] = getItemByOldName(inputName3)(
    renamedFilesForRenameTagAfterPD
  );
  const actual3 = foundItem3.newName;
  const expected3 = renamedName3;
  t.is(actual3, expected3, msg);
  const inputName4 = "2017-09-19 11.11.11-4 - some-dir .jpg";
  const renamedName4 = "2017-09-19 11.11.11-4 - some-dir.jpg";
  const [foundItem4] = getItemByOldName(inputName4)(
    renamedFilesForRenameTagAfterPD
  );
  const actual4 = foundItem4.newName;
  const expected4 = renamedName4;
  t.is(actual4, expected4, msg);
});
