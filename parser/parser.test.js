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
  
  expect(statement).toHaveProperty('expression');
  let identifier = statement.expression;
  
  expect(identifier).toHaveProperty('value');
  expect(identifier.value).toBe("foobar");
  expect(identifier.tokenLiteral()).toBe("foobar");
});
