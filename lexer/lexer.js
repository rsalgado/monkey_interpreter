const token = require('../token/token.js');
const tokenType = token.tokenTypes;


class Lexer {

  constructor(input) {
    this.input = input;
    this.position = null;
    this.readPosition = 0;
    this.ch = null;

    this.readChar();
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = 0;
    }
    else {
      this.ch = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  nextToken() {
    let token;
    
    switch(this.ch) {
//      case:
//        break;
      case '=':
        token = newToken(tokenType.ASSIGN, this.ch);
        break;

      case ';':
        token = newToken(tokenType.SEMICOLON, this.ch);
        break;

      case '(':
        token = newToken(tokenType.LPAREN, this.ch);
        break;

      case ')':
        token = newToken(tokenType.RPAREN, this.ch);
        break;

      case ',':
        token = newToken(tokenType.COMMA, this.ch);
        break;

      case '+':
        token = newToken(tokenType.PLUS, this.ch);
        break;

      case '{':
        token = newToken(tokenType.LBRACE, this.ch);
        break;

      case '}':
        token = newToken(tokenType.RBRACE, this.ch);
        break;

      case 0:
        token = {type: tokenType.EOF, literal: ""};
        break;
    }

    this.readChar();
    return token;
  }
}


function newToken(tokenType, char) {
  return {type: tokenType, literal: char};
}


module.exports = Lexer;