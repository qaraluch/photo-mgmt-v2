const test = require("ava");
const path = require("path");
const { XXX } = require("./index.js");

test.only("is function", t => {
  const msg = "should be a function ";
  const actual = typeof XXX === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("return promise", async t => {
  const msg = "should return a promise ";
  const actual = typeof (await XXX().then) === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("...", async t => {
  const msg = "should ...";
  const actual = await XXX();
  const expected = "";
  t.is(actual, expected, msg);
});
