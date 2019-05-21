const evaluator = require('./evaluator');
const Lexer = require('../lexer/lexer');
const Parser = require('../parser/parser');
const Environment = require('../object/environment').Environment;
const object = require('../object/object');
const objectType = object.objectType;



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
