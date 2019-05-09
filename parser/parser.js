const ast = require('../ast/ast');
const token = require('../token/token');
const tokenType = token.tokenTypes;


class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.currentToken = null;
    this.peekToken = null;

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram() {
    let program = new ast.Program();

    while (!this.isCurrentType(tokenType.EOF)) {
      let statement = this.parseStatement();

      if (statement !== null)
        program.statements.push(statement);

      this.nextToken();
    }

    return program;
  }

  parseStatement() {
    switch(this.currentToken.type) {
      case tokenType.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement() {
    let letToken = this.currentToken;

    if (!this.expectPeek(tokenType.IDENT))  return null;
    let name = new ast.Identifier(this.currentToken, this.currentToken.literal);

    if (!this.expectPeek(tokenType.ASSIGN)) return null;

    // TODO: For now we're skipping the expression until we encounter a semicolon
    while (!this.isCurrentType(tokenType.SEMICOLON))
      this.nextToken();

    let statement = new ast.LetStatement(letToken, name, null);
    return statement;
  }


  parseError(message) {
    console.error(message);
  }

  isCurrentType(type) {
    return this.currentToken.type === type;
  }

  isPeekToken(type) {
    return this.peekToken.type === type;
  }

  expectPeek(type) {
    if (this.isPeekToken(type)) {
      this.nextToken();
      return true;
    }
    else{
      this.peekError(type);
      return false;
    }
  }

  peekError(type) {
    let message = `expected next token to be ${type}, got ${this.peekToken.type} instead`;
    this.errors.push(message);
  }

}



module.exports = {
  Parser
};
