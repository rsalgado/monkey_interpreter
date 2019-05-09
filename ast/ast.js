
class Program {
  constructor() {
    this.statements = [];
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    else {
      return "";
    }
  }
}

class LetStatement {
  constructor(token, name, value) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode() {}

  tokenLiteral() {
    return this.token.literal;
  }
}

class Identifier {
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  expressionNode() {}

  tokenLiteral() {
    return this.token.literal;
  }
}


module.exports = {
  Program,
  LetStatement,
  Identifier
};
