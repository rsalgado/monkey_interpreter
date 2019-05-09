const Token = require('../token/token');
const Lexer = require('../lexer/lexer');
const parser = require('./parser');

const tokenType = Token.tokenTypes;
const Parser = parser.Parser;


test("Let Statement", () => {
  let input = `
  let x = 5;
  let y = 10;
  let foobar = 838383;
  `;

  let lexer = new Lexer(input);
  let p = new Parser(lexer);

  let program = p.parseProgram();

  expect(p.errors).toEqual([]);
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

