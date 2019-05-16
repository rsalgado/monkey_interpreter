const object = require('../object/object');
const evaluator = require('./evaluator');
const Lexer = require('../lexer/lexer');
const Parser = require('../parser/parser');


describe("eval integer expression", () => {
  let testcases = [
    {input: "5", expected: 5},
    {input: "10", expected: 10},
    {input: "-5", expected: -5},
    {input: "-10", expected: -10},
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


function testEval(input) {
  let lexer = new Lexer(input);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();

  return evaluator.evaluate(program);
}

function testIntegerObject(intObject, expectedInt) {
  expect(intObject instanceof object.Integer).toBe(true);
  expect(intObject.value).toBe(expectedInt);
}

function testBooleanObject(boolObject, expectedBool) {
  expect(boolObject instanceof object.Boolean).toBe(true);
  expect(boolObject.value).toBe(expectedBool);
}
