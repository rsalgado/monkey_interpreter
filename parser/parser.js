

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
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
    return null;
  }
}
