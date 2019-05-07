const tokenTypes = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",

  IDENT: "IDENT",
  INT: "INT",

  ASSIGN: "=",
  PLUS: "+",

  COMMA: ",",
  SEMICOLON: ";",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  FUNCTION: "FUNCTION",
  LET: "LET"
};

module.exports = {tokenTypes};
