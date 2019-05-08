const tokenTypes = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",

  IDENT: "IDENT",
  INT: "INT",

  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",
  LT: "<",
  GT: ">",

  COMMA: ",",
  SEMICOLON: ";",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  EQUALS: "==",
  DISTINCT: "!=",

  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
};

const keywords = {
  "fn": tokenTypes.FUNCTION,
  "let": tokenTypes.LET,
  "true": tokenTypes.TRUE,
  "false": tokenTypes.FALSE,
  "if": tokenTypes.IF,
  "else": tokenTypes.ELSE,
  "return": tokenTypes.RETURN
};


function lookupIdent(ident) {
  let type = keywords[ident];
  if (type) {
    return type;
  }
  return tokenTypes.IDENT;
}


module.exports = {
  tokenTypes,
  keywords,
  lookupIdent
};
