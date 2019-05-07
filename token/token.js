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

const keywords = {
  "fn": tokenTypes.FUNCTION,
  "let": tokenTypes.LET
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
