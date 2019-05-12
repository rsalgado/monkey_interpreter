const ast = require('../ast/ast');
const token = require('../token/token');
const tokenType = token.tokenTypes;

const precedences = {
  LOWEST: 0,
  EQUALS: 1,      // ==
  LESSGREATER: 2, // < or >
  SUM: 3,         // +
  PRODUCT: 4,     // *
  PREFIX: 5,      // -X or !X
  CALL: 6         // myFunction(X)
};

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.currentToken = null;
    this.peekToken = null;
    this.prefixParseFunctions = {};
    this.infixParseFunctions = {};

    this.registerPrefix(tokenType.IDENT, this.parseIdentifier);

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

      case tokenType.RETURN:
        return this.parseReturnStatement();

      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement() {
    let letToken = this.currentToken;

    if (!this.expectPeek(tokenType.IDENT))  return null;
    let name = new ast.Identifier(this.currentToken, this.currentToken.literal);

    if (!this.expectPeek(tokenType.ASSIGN)) return null;

    // TODO: For now we're skipping the expression until we encounter a semicolon
    while (!this.isCurrentType(tokenType.SEMICOLON)) {  this.nextToken(); }

    let statement = new ast.LetStatement(letToken, name, null);
    return statement;
  }

  parseReturnStatement() {
    let returnToken = this.currentToken;
    this.nextToken();

    // TODO: For now we're skipping the expression until we encounter a semicolon
    while (!this.isCurrentType(tokenType.SEMICOLON))  { this.nextToken(); }

    let statement = new ast.ReturnStatement(returnToken, null);
    return statement;
  }

  parseExpressionStatement() {
    let statement = new ast.ExpressionStatement();
    statement.token = this.currentToken;
    statement.expression = this.parseExpression(precedences.LOWEST);

    if (this.isPeekToken(tokenType.SEMICOLON))
      this.nextToken();
    
    return statement;
  }

  parseExpression(precedence) {
    let prefix = this.prefixParseFunctions[this.currentToken.type];
    if (!prefix)  return null;

    let leftExpression = prefix();
    return leftExpression;
  }

  parseIdentifier() {
    return new ast.Identifier(this.currentToken, this.currentToken.literal);
  }


  parseError(message) { console.error(message);  }

  isCurrentType(type) { return this.currentToken.type === type; }

  isPeekToken(type) { return this.peekToken.type === type; }

  registerPrefix(type, parseFunction) {
    // The binding is necessary due to the functions to be registered assuming
    // `this` points to the current object (like inside `parseIdentifier`)
    this.prefixParseFunctions[type] = parseFunction.bind(this);
  }

  registerInfix(type, parseFunction) {
    // The binding is necessary due to the functions to be registered assuming
    // `this` points to the current object (like inside `parseIdentifier`)
    this.infixParseFunctions[type] = parseFunction.bind(this);
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


module.exports = Parser;
