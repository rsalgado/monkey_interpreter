const Lexer = require("./lexer.js");
const Token = require("../token/token.js");
const tokenType = Token.tokenTypes;

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

test("nextToken function - Additional tokens", () => {
  let input = `
  !-/*5;
  5 < 10 > 5;

  if (5 < 10) {
    return true;
  } else {
    return false;
  }

  10 == 10;
  10 != 9;
  "foobar"
  "foo bar"
  `;

  let tests = [
    {type: tokenType.BANG, literal: "!"},
    {type: tokenType.MINUS, literal: "-"},
    {type: tokenType.SLASH, literal: "/"},
    {type: tokenType.ASTERISK, literal: "*"},
    {type: tokenType.INT, literal: "5"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.INT, literal: "5"},
    {type: tokenType.LT, literal: "<"},
    {type: tokenType.INT, literal: "10"},
    {type: tokenType.GT, literal: ">"},
    {type: tokenType.INT, literal: "5"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.IF, literal: "if"},
    {type: tokenType.LPAREN, literal: "("},
    {type: tokenType.INT, literal: "5"},
    {type: tokenType.LT, literal: "<"},
    {type: tokenType.INT, literal: "10"},
    {type: tokenType.RPAREN, literal: ")"},
    {type: tokenType.LBRACE, literal: "{"},

    {type: tokenType.RETURN, literal: "return"},
    {type: tokenType.TRUE, literal: "true"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.RBRACE, literal: "}"},
    {type: tokenType.ELSE, literal: "else"},
    {type: tokenType.LBRACE, literal: "{"},

    {type: tokenType.RETURN, literal: "return"},
    {type: tokenType.FALSE, literal: "false"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.RBRACE, literal: "}"},

    {type: tokenType.INT, literal: "10"},
    {type: tokenType.EQ, literal: "=="},
    {type: tokenType.INT, literal: "10"},
    {type: tokenType.SEMICOLON, literal: ";"},
    {type: tokenType.INT, literal: "10"},
    {type: tokenType.NOT_EQ, literal: "!="},
    {type: tokenType.INT, literal: "9"},
    {type: tokenType.SEMICOLON, literal: ";"},

    {type: tokenType.STRING, literal: "foobar"},
    {type: tokenType.STRING, literal: "foo bar"},

    {type: tokenType.EOF, literal: ""},
  ];

  let lexer = new Lexer(input);

  tests.forEach(expectedToken => {
    let token = lexer.nextToken();

    expect(token.type).toBe(expectedToken.type);
    expect(token.literal).toBe(expectedToken.literal);
  });
});
