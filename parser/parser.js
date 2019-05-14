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

const tokenPrecedence = {
  [tokenType.EQ]: precedences.EQUALS,
  [tokenType.NOT_EQ]: precedences.EQUALS,
  [tokenType.LT]: precedences.LESSGREATER,
  [tokenType.GT]: precedences.LESSGREATER,
  [tokenType.PLUS]: precedences.SUM,
  [tokenType.MINUS]: precedences.SUM,
  [tokenType.SLASH]: precedences.PRODUCT,
  [tokenType.ASTERISK]: precedences.PRODUCT
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
    this.registerPrefix(tokenType.INT, this.parseIntegerLiteral);
    this.registerPrefix(tokenType.TRUE, this.parseBoolean);
    this.registerPrefix(tokenType.FALSE, this.parseBoolean);
    this.registerPrefix(tokenType.BANG, this.parsePrefixExpression);
    this.registerPrefix(tokenType.MINUS, this.parsePrefixExpression);
    this.registerPrefix(tokenType.LPAREN, this.parseGroupedExpression);
    this.registerPrefix(tokenType.IF, this.parseIfExpression);

    this.registerInfix(tokenType.PLUS, this.parseInfixExpression);
    this.registerInfix(tokenType.MINUS, this.parseInfixExpression);
    this.registerInfix(tokenType.SLASH, this.parseInfixExpression);
    this.registerInfix(tokenType.ASTERISK, this.parseInfixExpression);
    this.registerInfix(tokenType.EQ, this.parseInfixExpression);
    this.registerInfix(tokenType.NOT_EQ, this.parseInfixExpression);
    this.registerInfix(tokenType.LT, this.parseInfixExpression);
    this.registerInfix(tokenType.GT, this.parseInfixExpression);

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  peekPrecedence() {
    let precedence = tokenPrecedence[this.peekToken.type];
    if (precedence !== undefined)
      return precedence;

    return precedences.LOWEST;
  }

  currentPrecedence() {
    let precedence = tokenPrecedence[this.currentToken.type];
    if (precedence !== undefined)
      return precedence;

    return precedences.LOWEST;
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
    if (!prefix) {
      let message = `No prefix parse function for ${this.currentToken.type} found`;
      this.errors.push(message);
      return null;
    }

    let leftExpression = prefix();

    while (!this.isPeekToken(tokenType.SEMICOLON) && precedence < this.peekPrecedence()) {
      let infix = this.infixParseFunctions[this.peekToken.type];
      if (!infix)
        return leftExpression;

      this.nextToken();
      leftExpression = infix(leftExpression);
    }

    return leftExpression;
  }

  parseIdentifier() {
    return new ast.Identifier(this.currentToken, this.currentToken.literal);
  }

  parseIntegerLiteral() {
    let value = parseInt(this.currentToken.literal);
    if (isNaN(value)) {
      let message = `could not parse ${this.currentToken.literal} as integer`;
      this.errors.push(message);
      return null;
    }

    return new ast.IntegerLiteral(this.currentToken, value);
  }

  parseBoolean() {
    return new ast.Boolean(this.currentToken, this.isCurrentType(tokenType.TRUE));
  }

  parsePrefixExpression() {
    let expression = new ast.PrefixExpression(this.currentToken, this.currentToken.literal);
    this.nextToken();

    expression.right = this.parseExpression(precedences.PREFIX);
    return expression;
  }

  parseInfixExpression(left) {
    let expression = new ast.InfixExpression(this.currentToken, this.currentToken.literal, left);

    let precedence = this.currentPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseGroupedExpression() {
    this.nextToken();
    let expression = this.parseExpression(precedences.LOWEST);

    if (!this.expectPeek(tokenType.RPAREN))
      return null;

    return expression;
  }

  parseIfExpression() {
    let expression = new ast.IfExpression(this.currentToken);

    if (!this.expectPeek(tokenType.LPAREN))   return null;
    this.nextToken();

    expression.condition = this.parseExpression(precedences.LOWEST);

    if (!this.expectPeek(tokenType.RPAREN))   return null;
    if (!this.expectPeek(tokenType.LBRACE))   return null;

    expression.consequence = this.parseBlockStatement();

    if (this.isPeekToken(tokenType.ELSE)) {
      this.nextToken();
      if (!this.expectPeek(tokenType.LBRACE))   return null;

      expression.alternative = this.parseBlockStatement();
    }

    return expression;
  }

  parseBlockStatement() {
    let block = new ast.BlockStatement(this.currentToken);

    this.nextToken();

    while (!this.isCurrentType(tokenType.RBRACE) && !this.isCurrentType(tokenType.EOF)) {
      let statement = this.parseStatement();
      if (statement)
        block.statements.push(statement);

      this.nextToken();
    }

    return block;
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
