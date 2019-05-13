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
  
  expect(identifier).toHaveProperty("value");
  expect(identifier.value).toBe("foobar");
  expect(identifier.tokenLiteral()).toBe("foobar");
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
  let literal = statement.expression;

  expect(literal).toHaveProperty("value");
  expect(literal.value).toBe(5);
  expect(literal.tokenLiteral()).toBe("5");
});

test("prefix operator expressions", () => {
  let tests = [
    {input: "!5;", operator: "!", value: 5},
    {input: "-15", operator: "-", value: 15}
  ];

  tests.forEach(testcase => {
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

    let rightExpression = expression.right;
    expect(rightExpression.value).toBe(testcase.value);
    expect(rightExpression.tokenLiteral()).toBe(`${testcase.value}`);
  });
});

test("infix operator expressions", () => {
  let tests = [
    {input: "5 + 5;", leftValue: 5, operator: "+", rightValue: 5},
    {input: "5 - 5;", leftValue: 5, operator: "-", rightValue: 5},
    {input: "5 * 5;", leftValue: 5, operator: "*", rightValue: 5},
    {input: "5 / 5;", leftValue: 5, operator: "/", rightValue: 5},

    {input: "5 > 5;", leftValue: 5, operator: ">", rightValue: 5},
    {input: "5 < 5;", leftValue: 5, operator: "<", rightValue: 5},
    {input: "5 == 5;", leftValue: 5, operator: "==", rightValue: 5},
    {input: "5 != 5;", leftValue: 5, operator: "!=", rightValue: 5},
  ];

  tests.forEach(testcase => {
    let lexer = new Lexer(testcase.input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.statements.length).toBe(1);

    let statement = program.statements[0];
    expect(statement).toHaveProperty("expression");

    let expression = statement.expression;
    expect(expression).toHaveProperty("operator");
    expect(expression).toHaveProperty("left");
    expect(expression).toHaveProperty("right");

    
    let leftExpression = expression.left;
    let rightExpression = expression.right;
    let operator = expression.operator;

    expect(leftExpression.value).toBe(testcase.leftValue);
    expect(leftExpression.tokenLiteral()).toBe(`${testcase.leftValue}`);

    expect(rightExpression.value).toBe(testcase.rightValue);
    expect(rightExpression.tokenLiteral()).toBe(`${testcase.rightValue}`);

    expect(operator).toBe(testcase.operator);
  });
});

test("operator precedence parsing", () => {
  let tests = [
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
    {input: "3 + 4 * 5 == 3 * 1 + 4 * 5;", expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)));"}
  ];

  tests.forEach(testcase => {
    let lexer = new Lexer(testcase.input);
    let parser = new Parser(lexer);
    let program = parser.parseProgram();

    expect(parser.errors).toEqual([]);
    expect(program.toString()).toBe(testcase.expected);
  });
});
