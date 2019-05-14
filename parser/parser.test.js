const Token = require('../token/token');
const Lexer = require('../lexer/lexer');
const Parser = require('./parser');
const ast = require('../ast/ast');

const tokenType = Token.tokenTypes;


test("`let` statement", () => {
  let input = `
  let x = 5;
  let y = 10;
  let foobar = 838383;
  `;

  let lexer = new Lexer(input);
  let parser = new Parser(lexer);

  let program = parser.parseProgram();

  expect(parser.errors).toEqual([]);
  expect(program).not.toBe(null);
  expect(program.statements.length).toBe(3);

  let tests = [
    "x",
    "y",
    "foobar"
  ];

  tests.forEach((identifier, i) => {
    let statement = program.statements[i];

    expect(statement.token.literal).toBe("let");
    expect(statement.token.type).toBe(tokenType.LET);

    expect(statement.name.value).toBe(identifier);
    expect(statement.name.token.literal).toBe(identifier);
  });
});

test("`return` statement", () => {
  let input = `
  return 5;
  return 10;
  return 993322;
  `;

  let lexer = new Lexer(input);
  let parser = new Parser(lexer);

  let program = parser.parseProgram();

  expect(parser.errors).toEqual([]);
  expect(program.statements.length).toBe(3);

  program.statements.forEach(st => {
    expect(st.token.literal).toBe("return");
    expect(st.token.type).toBe(tokenType.RETURN);
  });
});

test("program string representation with `toString()`",  () => {
  let program = new ast.Program();
  program.statements = [
    new ast.LetStatement(
      {
        type: tokenType.LET,
        literal: "let"
      },
      new ast.Identifier(
        {
          type: tokenType.IDENT,
          literal: "myVar"
        },
        "myVar"
      ),
      new ast.Identifier(
        {
          type: tokenType.IDENT,
          literal: "anotherVar"
        },
        "anotherVar"
      )
    )
  ];

  expect(program.toString()).toBe("let myVar = anotherVar;");
});

test("identifier expression", () => {
  let input = "foobar;";

  let lexer = new Lexer(input);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();

  expect(program.statements.length).toBe(1);
  let statement = program.statements[0];
  
  expect(statement).toHaveProperty("expression");
  let identifier = statement.expression;

  testIdentifier(identifier, "foobar");
});

test("integer literal expression", () => {
  let input = "5;";
  
  let lexer = new Lexer(input);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();

  expect(parser.errors).toEqual([]);
  expect(program.statements.length).toBe(1);
  let statement = program.statements[0];

  expect(statement).toHaveProperty("expression");
  let expression = statement.expression;

  testIntegerLiteral(expression, 5);
});

test("boolean literal expression", () => {
  let input = "true";
  let lexer = new Lexer(input);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();

  expect(parser.errors).toEqual([]);
  expect(program.statements.length).toBe(1);
  let statement = program.statements[0];

  expect(statement).toHaveProperty("expression");
  let expression = statement.expression;

  testBoolean(expression, true);
});


describe("if expressions", () => {
  test("if expression", () => {
    let input = "if (x < y) { x };";

    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.statements.length).toBe(1);

    let statement = program.statements[0];
    expect(statement instanceof ast.ExpressionStatement).toBe(true);
    let expression = statement.expression;
    expect(expression instanceof ast.IfExpression).toBe(true);

    testInfixExpression(expression.condition, "x", "<", "y");

    let consequence = expression.consequence;
    expect(consequence.statements.length).toBe(1);

    let consequenceStatement = consequence.statements[0];
    expect(consequenceStatement instanceof ast.ExpressionStatement);
    testIdentifier(consequenceStatement.expression, "x");

    let alternative = expression.alternative;
    expect(alternative).toBe(null);
  });

  test("if-else expression", () => {
    let input = "if (x < y) { x } else { y };";

    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.statements.length).toBe(1);

    let statement = program.statements[0];
    expect(statement instanceof ast.ExpressionStatement).toBe(true);
    let expression = statement.expression;
    expect(expression instanceof ast.IfExpression).toBe(true);

    testInfixExpression(expression.condition, "x", "<", "y");

    let consequence = expression.consequence;
    expect(consequence.statements.length).toBe(1);

    let consequenceStatement = consequence.statements[0];
    expect(consequenceStatement instanceof ast.ExpressionStatement);
    testIdentifier(consequenceStatement.expression, "x");


    let alternative = expression.alternative;
    expect(alternative.statements.length).toBe(1);

    let alternativeStatement = alternative.statements[0];
    expect(alternativeStatement instanceof ast.ExpressionStatement);
    testIdentifier(alternativeStatement.expression, "y");
  });
});

test("function literal expression", () => {
  let input = "fn(x, y) { x + y; }";
  let lexer = new Lexer(input);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();

  expect(parser.errors).toEqual([]);
  expect(program.statements.length).toBe(1);

  let statement = program.statements[0];
  expect(statement instanceof ast.ExpressionStatement).toBe(true);

  let func = statement.expression;
  expect(func instanceof ast.FunctionLiteral).toBe(true);
  expect(func.parameters.length).toBe(2);
  
  testLiteralExpression(func.parameters[0], "x");
  testLiteralExpression(func.parameters[1], "y");

  expect(func.body.statements.length).toBe(1);

  let bodyStatement = func.body.statements[0];
  expect(bodyStatement instanceof ast.ExpressionStatement).toBe(true);

  testInfixExpression(bodyStatement.expression, "x", "+", "y");
});

describe("function parameter parsing", () => {
  let testcases = [
    {input: "fn() {};", expectedParams: []},
    {input: "fn(x) {};", expectedParams: ["x"]},
    {input: "fn(x, y, z) {};", expectedParams: ["x", "y", "z"]},
  ];

  test.each(testcases)("%p", (testcase) => {
    let lexer = new Lexer(testcase.input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    let statement = program.statements[0];
    let func = statement.expression;

    expect(func.parameters.length).toBe(testcase.expectedParams.length);
    testcase.expectedParams.forEach((ep, i) => {
      testLiteralExpression(func.parameters[i], ep)
    });
  });
});


describe("prefix operator expressions", () => {
  let testcases = [
    {input: "!5;", operator: "!", value: 5},
    {input: "-15", operator: "-", value: 15},
    {input: "!true;", operator: "!", value: true},
    {input: "!false;", operator: "!", value: false},
  ];

  test.each(testcases)("%p", (testcase) => {
    let lexer = new Lexer(testcase.input);
    let parser  = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.statements.length).toBe(1);

    let statement = program.statements[0];
    expect(statement).toHaveProperty("expression");

    let expression = statement.expression;
    expect(expression).toHaveProperty("operator");
    expect(expression).toHaveProperty("right");
    expect(expression.operator).toBe(testcase.operator);

    testLiteralExpression(expression.right, testcase.value);
  });
});

describe("infix operator expressions", () => {
  let testcases = [
    {input: "5 + 5;", leftValue: 5, operator: "+", rightValue: 5},
    {input: "5 - 5;", leftValue: 5, operator: "-", rightValue: 5},
    {input: "5 * 5;", leftValue: 5, operator: "*", rightValue: 5},
    {input: "5 / 5;", leftValue: 5, operator: "/", rightValue: 5},

    {input: "5 > 5;", leftValue: 5, operator: ">", rightValue: 5},
    {input: "5 < 5;", leftValue: 5, operator: "<", rightValue: 5},
    {input: "5 == 5;", leftValue: 5, operator: "==", rightValue: 5},
    {input: "5 != 5;", leftValue: 5, operator: "!=", rightValue: 5},

    {input: "true == true", leftValue: true, operator: "==", rightValue: true},
    {input: "true != false", leftValue: true, operator: "!=", rightValue: false},
    {input: "false == false", leftValue: false, operator: "==", rightValue: false},
  ];

  test.each(testcases)("%p", (testcase) => {
    let lexer = new Lexer(testcase.input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.statements.length).toBe(1);

    let statement = program.statements[0];
    expect(statement).toHaveProperty("expression");

    let expression = statement.expression;

    testInfixExpression(expression, testcase.leftValue, testcase.operator, testcase.rightValue);
  });
});

describe("operator precedence parsing", () => {
  let testcases = [
    {input: "-a * b;", expected: "((-a) * b);"},
    {input: "!-a;", expected: "(!(-a));"},
    {input: "a + b + c;", expected: "((a + b) + c);"},
    {input: "a + b - c;", expected: "((a + b) - c);"},
    {input: " a * b * c;", expected: "((a * b) * c);"},
    {input: "a * b / c;", expected: "((a * b) / c);"},
    {input: "a + b / c;", expected: "(a + (b / c));"},
    {input: "a + b * c + d / e - f;", expected: "(((a + (b * c)) + (d / e)) - f);"},
    {input: "3 + 4; -5 * 5;", expected: "(3 + 4);\n((-5) * 5);"},
    {input: "5 > 4 == 3 < 4;", expected: "((5 > 4) == (3 < 4));"},
    {input: "5 < 4 != 3 > 4;", expected: "((5 < 4) != (3 > 4));"},
    {input: "3 + 4 * 5 == 3 * 1 + 4 * 5;", expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)));"},

    {input: "true;", expected: "true;"},
    {input: "false;", expected: "false;"},
    {input: "3 > 5 == false;", expected: "((3 > 5) == false);"},
    {input: "3 < 5 == true;", expected: "((3 < 5) == true);"},

    {input: "1 + (2 + 3) + 4;", expected: "((1 + (2 + 3)) + 4);"},
    {input: "(5 + 5) * 2;", expected: "((5 + 5) * 2);"},
    {input: "2 / (5 + 5);", expected: "(2 / (5 + 5));"},
    {input: "-(5 + 5);", expected: "(-(5 + 5));"},
    {input: "!(true == true);", expected: "(!(true == true));"}
  ];

  test.each(testcases)("%p", (testcase) => {
    let lexer = new Lexer(testcase.input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.toString()).toBe(testcase.expected);
  });
});


function testInfixExpression(expression, left, operator, right) {
  expect(expression instanceof ast.InfixExpression).toBe(true);
  expect(expression.operator).toBe(operator);
  testLiteralExpression(expression.left, left);
  testLiteralExpression(expression.right, right);
}

function testLiteralExpression(expression, value) {
  if (expression instanceof ast.IntegerLiteral)
    testIntegerLiteral(expression, value);
  else if (expression instanceof ast.Identifier)
    testIdentifier(expression, value);
  else if (expression instanceof ast.Boolean)
    testBoolean(expression, value);
  else
    return;
}

function testIntegerLiteral(expression, value) {
  expect(expression instanceof ast.IntegerLiteral).toBe(true);
  expect(expression.value).toBe(value);
  expect(expression.tokenLiteral()).toBe(`${value}`);
}

function testIdentifier(expression, value) {
  expect(expression instanceof ast.Identifier).toBe(true);
  expect(expression.value).toBe(value);
  expect(expression.tokenLiteral()).toBe(`${value}`);
}

function testBoolean(expression, value) {
  expect(expression instanceof ast.Boolean).toBe(true);
  expect(expression.value).toBe(value);
  expect(expression.tokenLiteral()).toBe(`${value}`);
}
