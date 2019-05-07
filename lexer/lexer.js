const Token = require('../token/token.js');
const tokenType = Token.tokenTypes;


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

    this.skipWhitespace();
    
    switch(this.ch) {
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

      default:
        if (isLetter(this.ch)) {
          let literal = this.readIdentifier();
          let type = Token.lookupIdent(literal);

          return {type: type, literal: literal};
        }

        else if (isDigit(this.ch)) {
          let type = tokenType.INT;
          let literal = this.readNumber();

          return {type: type, literal: literal};
        }

        else {
          token = newToken(tokenType.ILLEGAL, this.ch);
        }
        break;
    }

    this.readChar();
    return token;
  }


  skipWhitespace() {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  readIdentifier() {
    let position = this.position;

    while (isLetter(this.ch)) { this.readChar(); }

    return this.input.slice(position, this.position);
  }

  readNumber() {
    let position = this.position;

    while (isDigit(this.ch)) {  this.readChar(); }

    return this.input.slice(position, this.position);
  }

}


function newToken(tokenType, char) {
  return {type: tokenType, literal: char};
}

function isLetter(char) {
  return /^[a-zA-Z_]$/.test(char);
}

function isDigit(char) {
  return /^[0-9]$/.test(char);
}


module.exports = Lexer;
