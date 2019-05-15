
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
  constructor(token, name = null, value = null) {
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
  constructor(token, returnValue = null) {
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
  constructor(token, value = null) {
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
  constructor(token, value = null) {
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
  constructor(token, operator = null) {
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
  constructor(token, operator = null, left = null) {
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
  constructor(token, value = null) {
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


class IfExpression {
  constructor(token, condition = null, consequence = null, alternative = null) {
    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    let string = `if ${this.condition} ${this.consequence}`;
    if (this.alternative)
      string += ` else ${this.alternative}`;

    return string;
  }
}

class BlockStatement {
  constructor(token) {
    this.token = token;
    this.statements = [];
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return "{\n" + this.statements.map(st => "\t" + st.toString()).join("\n") + "\n}";
  }
}

class FunctionLiteral {
  constructor(token) {
    this.token = token;
    this.parameters = [];
    this.body = null;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    let tokenLiteral = this.tokenLiteral();
    let parametersString = this.parameters.map(p => p.toString()).join(", ");
    return `${tokenLiteral}(${parametersString}) ${this.body}`;
  }
}

class CallExpression {
  constructor(token, func) {
    this.token = token;
    this.func = func;
    this.args = [];
  }

  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    let args = this.args.map(a => a.toString()).join(", ");
    return `${this.func}(${args})`;
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
  Boolean,
  IfExpression,
  BlockStatement,
  FunctionLiteral,
  CallExpression
};
