const object = require("./object");

test("string hash keys", () => {
  let hello1 = new object.String("Hello World");
  let hello2 = new object.String("Hello World");
  let diff1 = new object.String("My name is johnny");
  let diff2 = new object.String("My name is johnny");

  expect(hello1.hashKey()).toEqual(hello2.hashKey());
  expect(diff1.hashKey()).toEqual(diff2.hashKey());
  expect(hello1.hashKey()).not.toEqual(diff1.hashKey());
});

test("integer hash keys", () => {
  let hello1 = new object.Integer(123);
  let hello2 = new object.Integer(123);
  let diff1 = new object.Integer(456);
  let diff2 = new object.Integer(456);

  expect(hello1.hashKey()).toEqual(hello2.hashKey());
  expect(diff1.hashKey()).toEqual(diff2.hashKey());
  expect(hello1.hashKey()).not.toEqual(diff1.hashKey());
});

test("boolean hash keys", () => {
  let hello1 = new object.Boolean(true);
  let hello2 = new object.Boolean(true);
  let diff1 = new object.Boolean(false);
  let diff2 = new object.Boolean(false);

  expect(hello1.hashKey()).toEqual(hello2.hashKey());
  expect(diff1.hashKey()).toEqual(diff2.hashKey());
  expect(hello1.hashKey()).not.toEqual(diff1.hashKey());
});
