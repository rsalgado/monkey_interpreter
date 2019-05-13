
class Program {

  constructor() {
    this.statements = [];
  }

  tokenLiteral() {
    if (this.statements.length > 0)
      return this.statements[0].tokenLiteral();
    else
      return "";
  }

  toString() {
    return this.statements
              .map(st => st.toString())
              .join("\n");
  }
}


class LetStatement {
  constructor(token, name, value) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return `${this.tokenLiteral()} ${this.name} = ${this.value};`;
  }
}

class ReturnStatement {
  constructor(token, returnValue) {
    this.token = token;
    this.returnValue = returnValue;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return `${this.tokenLiteral()} ${this.returnValue};`;
  }
}

class ExpressionStatement {
  constructor() {
    this.token = null;
    this.expression = null;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return `${this.expression};`;
  }
}

class Identifier {
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return this.value;
  }
}

class IntegerLiteral {
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return this.token.literal;
  }
}

class PrefixExpression {
  constructor(token, operator) {
    this.token = token;
    this.operator = operator;
    this.right = null;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return `(${this.operator}${this.right})`;
  }
}

class InfixExpression {
  constructor(token, operator, left) {
    this.token = token;
    this.operator = operator;
    this.left = left;
    this.right = null;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return `(${this.left} ${this.operator} ${this.right})`;
  }
}

class Boolean {
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return this.token.literal;
  }
}


module.exports = {
  Program,
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
  Boolean
};

