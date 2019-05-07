const Lexer = require("./lexer.js");
const token = require("../token/token.js");
const tokenType = token.tokenTypes;

test("nextToken function", () => {
  let input = "=+(){},;";

  let tests = [
    {expectedType: tokenType.ASSIGN, expectedLiteral: "="},
    {expectedType: tokenType.PLUS, expectedLiteral: "+"},
    {expectedType: tokenType.LPAREN, expectedLiteral: "("},
    {expectedType: tokenType.RPAREN, expectedLiteral: ")"},
    {expectedType: tokenType.LBRACE, expectedLiteral: "{"},
    {expectedType: tokenType.RBRACE, expectedLiteral: "}"},
    {expectedType: tokenType.COMMA, expectedLiteral: ","},
    {expectedType: tokenType.SEMICOLON, expectedLiteral: ";"},
    {expectedType: tokenType.EOF, expectedLiteral: ""},
  ];

  let lexer = new Lexer(input);

  for (let i = 0; i < tests.length; i++) {
    let token = lexer.nextToken();
    let currentTest = tests[i];

    expect(token.type).toBe(currentTest.expectedType);
    expect(token.literal).toBe(currentTest.expectedLiteral);
  }
});
