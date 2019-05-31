const evaluator = require('./evaluator');
const Lexer = require('../lexer/lexer');
const Parser = require('../parser/parser');
const Environment = require('../object/environment').Environment;
const object = require('../object/object');



describe("eval integer expression", () => {
  let testcases = [
    {input: "5", expected: 5},
    {input: "10", expected: 10},

    {input: "-5", expected: -5},
    {input: "-10", expected: -10},

    {input: "5 + 5 + 5 + 5 -10", expected: 10},
    {input: "2 * 2 * 2 * 2 * 2", expected: 32},
    {input: "-50 + 100 + -50", expected: 0},
    {input: "5 * 2 + 10", expected: 20},
    {input: "5 + 2 * 10", expected: 25},
    {input: "20 + 2 * -10", expected: 0},
    {input: "50 / 2 * 2 + 10", expected: 60},
    {input: "2 * (5 + 10)", expected: 30},
    {input: "3 * 3 * 3 + 10", expected: 37},
    {input: "3 * (3 * 3) + 10", expected: 37},
    {input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50},
  ];

  test.each(testcases)("%p", (testcase) => {
    let evaluated = testEval(testcase.input);
    testIntegerObject(evaluated, testcase.expected);
  });
});

describe("eval boolean expression", () => {
  let testcases = [
    {input: "true", expected: true},
    {input: "false", expected: false},
    {input: "1 < 2", expected: true},
    {input: "1 > 2", expected: false},
    {input: "1 < 1", expected: false},
    {input: "1 > 1", expected: false},
    {input: "1 == 1", expected: true},
    {input: "1 != 1", expected: false},
    {input: "1 == 2", expected: false},
    {input: "1 != 2", expected: true},

    {input: "true == true", expected: true},
    {input: "false == false", expected: true},
    {input: "true == false", expected: false},
    {input: "true != false", expected: true},
    {input: "false != true", expected: true},
    {input: "(1 < 2) == true", expected: true},
    {input: "(1 < 2) == false", expected: false},
    {input: "(1 > 2) == true", expected: false},
    {input: "(1 > 2) == false", expected: true},
  ];

  test.each(testcases)("%p", (testcase) => {
    let evaluated = testEval(testcase.input);
    testBooleanObject(evaluated, testcase.expected);
  });
});

test("eval string literal", () => {
  let input = `"Hello World!"`;
  let evaluated = testEval(input);
  
  expect(evaluated instanceof object.String).toBe(true);
  expect(evaluated.value).toBe("Hello World!");
});

test("string concatenation", () => {
  let input = `"Hello" + " " + "World!"`;
  let evaluated = testEval(input);

  expect(evaluated instanceof object.String).toBe(true);
  expect(evaluated.value).toBe("Hello World!");
});

describe("bang operator", () => {
  let testcases = [
    {input: "!true", expected: false},
    {input: "!false", expected: true},
    {input: "!5", expected: false},
    {input: "!!true", expected: true},
    {input: "!!false", expected: false},
    {input: "!!5", expected: true},
  ];

  test.each(testcases)("%p", (testcase) => {
    let evaluated = testEval(testcase.input);
    testBooleanObject(evaluated, testcase.expected);
  });
});

describe("if-else expressions", () => {
  let testcases = [
    {input: "if (true) { 10 }", expected: 10},
    {input: "if (false) { 10 }", expected: null},
    {input: "if (1) { 10 }", expected: 10},
    {input: "if (1 < 2) { 10 }", expected: 10},
    {input: "if (1 > 2) { 10 }", expected: null},
    {input: "if (1 > 2) { 10 } else { 20 }", expected: 20},
    {input: "if (1 < 2) { 10 } else { 20 }", expected: 10},
  ];

  test.each(testcases)("%p", (testcase) => {
    let evaluated = testEval(testcase.input);
    let integer = testcase.expected;

    if (integer)
      testIntegerObject(evaluated, integer);
    else
      testNullObject(evaluated);
  });
});

describe("return statements", () => {
  let testcases = [
    {input: "return 10;", expected: 10},
    {input: "return 10; 9;", expected: 10},
    {input: "return 2 * 5; 9;", expected: 10},
    {input: "9; return 2 * 5; 9;", expected: 10},
    {input: `
      if (10 > 1) {
        if (10 > 1) {
          return 10;
        }
        return 1;
      }
    `, expected: 10},
  ];

  test.each(testcases)("%p", (testcase) => {
    let evaluated = testEval(testcase.input);
    testIntegerObject(evaluated, testcase.expected);
  });
});

describe("error handling", () => {
  let testcases = [
    {input: "5 + true;", expectedMessage: "type mismatch: INTEGER + BOOLEAN"},
    {input: "5 + true; 5", expectedMessage: "type mismatch: INTEGER + BOOLEAN"},
    {input: "-true", expectedMessage: "unknown operator: -BOOLEAN"},
    {input: "true + false;", expectedMessage: "unknown operator: BOOLEAN + BOOLEAN"},
    {input: "5; true + false; 5", expectedMessage: "unknown operator: BOOLEAN + BOOLEAN"},
    {input: "if (10 > 1) { true + false; }", expectedMessage: "unknown operator: BOOLEAN + BOOLEAN"},
    {input: `
      if (10 > 1) {
        if (10 > 1) {
          return true + false;
        }
        return 1;
      }
    `, expectedMessage: "unknown operator: BOOLEAN + BOOLEAN"},
    {input: "foobar", expectedMessage: "identifier not found: foobar"},
    {input: `"Hello" - "World"`, expectedMessage: "unknown operator: STRING - STRING"},
  ];

  test.each(testcases)("%p", testcase => {
    let evaluated = testEval(testcase.input);
    expect(evaluated instanceof object.Error).toBe(true);
    expect(evaluated.message).toBe(testcase.expectedMessage);
  });
});

describe("let statements", () => {
  let testcases = [
    {input: "let a = 5; a;", expected: 5},
    {input: "let a = 5 * 5; a;", expected: 25},
    {input: "let a = 5; let b = a; b;", expected: 5},
    {input: "let a = 5; let b = a; let c = a + b + 5; c;", expected: 15},
  ];

  test.each(testcases)("%p", (testcase) => {
    let evaluated = testEval(testcase.input);
    testIntegerObject(evaluated, testcase.expected);
  });
});

test("function object", () => {
  let input = "fn(x) { x + 2; };";
  let evaluated = testEval(input);
  expect(evaluated instanceof object.Function).toBe(true);
  expect(evaluated.parameters.length).toBe(1);
  expect(evaluated.parameters[0].toString()).toBe("x");

  expect(evaluated.body.statements.length).toBe(1);

  let firstStatement = evaluated.body.statements[0];
  let expectedBody = "(x + 2);";
  expect(firstStatement.toString()).toBe(expectedBody);
});

test("function closures", () => {
  let input = `
let newAdder = fn(x) {
  fn(y) { x + y };
};

let addTwo = newAdder(2);
addTwo(2);`;

  let evaluated = testEval(input);
  testIntegerObject(evaluated, 4);
});

describe("function application", () => {
  let testcases = [
    {input: "let identity = fn(x) { x; }; identity(5);", expected: 5},
    {input: "let identity = fn(x) { return x; }; identity(5);", expected: 5},
    {input: "let double = fn(x) { x * 2; }; double(5);", expected: 10},
    {input: "let add = fn(x, y) { x + y; }; add(5, 5);", expected: 10},
    {input: "let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", expected: 20},
    {input: "fn(x) { x; }(5);", expected: 5},
  ];

  test.each(testcases)("%p", testcase => {
    let evaluated = testEval(testcase.input);
    testIntegerObject(evaluated, testcase.expected);
  });
});

describe("built-in functions", () => {
  let testcases = [
    {input: `len("")`, expected: 0},
    {input: `len("four")`, expected: 4},
    {input: `len("hello world")`, expected: 11},
    {input: `len([])`, expected: 0},
    {input: `len(["single"])`, expected: 1},
    {input: `len([2, 3, 5, 7])`, expected: 4},
    {input: `len(1)`, expected: "argument to `len` not supported, got INTEGER"},
    {input: `len("one", "two")`, expected: "wrong number of arguments. got=2, want=1"},

    {input: `first([1, 2, 3])`, expected: 1},
    {input: `first([])`, expected: null},
    {input: `first(1)`, expected: "argument to `first` must be ARRAY, got INTEGER"},
    {input: `last([1, 2, 3])`, expected: 3},
    {input: `last([])`, expected: null},
    {input: `last(1)`, expected: "argument to `last` must be ARRAY, got INTEGER"},
    {input: `rest([1, 2, 3])`, expected: [2, 3]},
    {input: `rest([])`, expected: null},
    {input: `push([], 1)`, expected: [1]},
    {input: `push(1, 1)`, expected: "argument to `push` must be ARRAY, got INTEGER"},
  ];

  test.each(testcases)("%p", testcase => {
    let evaluated = testEval(testcase.input);

    if (typeof testcase.expected === "number")
        testIntegerObject(evaluated, testcase.expected);

    else if (typeof testcase.expected === "string") {
        let errorObj = evaluated;
        expect(errorObj instanceof object.Error).toBe(true);
        expect(errorObj.message).toBe(testcase.expected);
    }

    else if (testcase.expected === null)
      testNullObject(evaluated);
  
    else if (testcase.expected instanceof Array) {
      expect(evaluated instanceof object.Array).toBe(true);
      expect(evaluated.elements.length).toBe(testcase.expected.length);

      testcase.expected.forEach((el, i) => {
        let intObject = evaluated.elements[i];
        testIntegerObject(intObject, el);
      });
    }
  });
});

test("array literals", () => {
  let input = "[1, 2 * 2, 3 + 3]";
  let evaluated = testEval(input);

  expect(evaluated instanceof object.Array).toBe(true);
  expect(evaluated.elements.length).toBe(3);

  testIntegerObject(evaluated.elements[0], 1);
  testIntegerObject(evaluated.elements[1], 4);
  testIntegerObject(evaluated.elements[2], 6);
});

test("hash literal", () => {
  let input = `let two = "two";
  {
    "one": 10 - 9,
    "two": 1 + 1,
    "thr" + "ee": 6 / 2,
    4: 4,
    true: 5,
    false: 6
  }`;

  let evaluated = testEval(input);
  expect(evaluated instanceof object.Hash);

  let expected = [
    {key: new object.String("one").hashKey().value, value: 1},
    {key: new object.String("two").hashKey().value, value: 2},
    {key: new object.String("three").hashKey().value, value: 3},
    {key: new object.Integer(4).hashKey().value, value: 4},
    {key: new object.Boolean(true).hashKey().value, value: 5},
    {key: new object.Boolean(false).hashKey().value, value: 6},
  ];

  expect(Object.keys(evaluated.pairs).length).toBe(expected.length);

  for (let expectedEntry of expected) {
    let expectedKey = expectedEntry.key;
    let expectedValue = expectedEntry.value;

    let pair = evaluated.pairs[expectedKey];
    expect(pair instanceof object.HashPair).toBe(true);
    
    testIntegerObject(pair.value, expectedValue);
  }
});

describe("array index expressions", () => {
  let testcases = [
    {input: "[1, 2, 3][0]", expected: 1},
    {input: "[1, 2, 3][1]", expected: 2},
    {input: "[1, 2, 3][2]", expected: 3},
    {input: "let i = 0; [1][i];", expected: 1},
    {input: "[1, 2, 3][1 + 1];", expected: 3},
    {input: "let myArray = [1, 2, 3]; myArray[2];", expected: 3},
    {input: "let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];", expected: 6},
    {input: "let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i];", expected: 2},
    {input: "[1, 2, 3][3]", expected: null},
    {input: "[1, 2, 3][-1]", expected: null},
  ];

  test.each(testcases)("%p", testcase => {
    let evaluated = testEval(testcase.input);
    let integer = testcase.expected;

    if (integer !== null)
      testIntegerObject(evaluated, integer);
    else
      testNullObject(evaluated);
  });
});


function testEval(input) {
  let lexer = new Lexer(input);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();
  let env = new Environment();

  return evaluator.evaluate(program, env);
}

function testIntegerObject(intObject, expectedInt) {
  expect(intObject instanceof object.Integer).toBe(true);
  expect(intObject.value).toBe(expectedInt);
}

function testBooleanObject(boolObject, expectedBool) {
  expect(boolObject instanceof object.Boolean).toBe(true);
  expect(boolObject.value).toBe(expectedBool);
}

function testNullObject(obj) {
  expect(obj instanceof object.Null).toBe(true);
}
