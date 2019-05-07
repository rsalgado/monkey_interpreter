const Lexer = require("./lexer.js");
const token = require("../token/token.js");
const tokenType = token.tokenTypes;

test("nextToken function", () => {
  let input = `
  let five = 5;
  let ten = 10;

  let add = fn(x, y) {
    x + y;
  }

  let result = add(five, ten);`;

  let tests = [
    {type: tokenType.LET, literal: "let"},
    {type: tokenType.IDENT, literal: "five"},
    {type: tokenType.ASSIGN, literal: "="},
    {type: tokenType.INT, literal: "5"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.LET, literal: "let"},
    {type: tokenType.IDENT, literal: "ten"},
    {type: tokenType.ASSIGN, literal: "="},
    {type: tokenType.INT, literal: "10"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.LET, literal: "let"},
    {type: tokenType.IDENT, literal: "add"},
    {type: tokenType.ASSIGN, literal: "="},
    {type: tokenType.FUNCTION, literal: "fn"},
    {type: tokenType.LPAREN, literal: "("},
    {type: tokenType.IDENT, literal: "x"},
    {type: tokenType.COMMA, literal: ","},
    {type: tokenType.IDENT, literal: "y"},
    {type: tokenType.RPAREN, literal: ")"},
    {type: tokenType.LBRACE, literal: "{"},

    {type: tokenType.IDENT, literal: "x"},
    {type: tokenType.PLUS, literal: "+"},
    {type: tokenType.IDENT, literal: "y"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.RBRACE, literal: "}"},

    {type: tokenType.LET, literal: "let"},
    {type: tokenType.IDENT, literal: "result"},
    {type: tokenType.ASSIGN, literal: "="},
    {type: tokenType.IDENT, literal: "add"},
    {type: tokenType.LPAREN, literal: "("},
    {type: tokenType.IDENT, literal: "five"},
    {type: tokenType.COMMA, literal: ","},
    {type: tokenType.IDENT, literal: "ten"},
    {type: tokenType.RPAREN, literal: ")"},
    {type: tokenType.SEMICOLON, literal: ";"},
    {type: tokenType.EOF, literal: ""},
  ];

  let lexer = new Lexer(input);

  tests.forEach((expectedToken) => {
    let token = lexer.nextToken();

    expect(token.type).toBe(expectedToken.type);
    expect(token.literal).toBe(expectedToken.literal);
  });
});
