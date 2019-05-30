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
    if (this.readPosition >= this.input.length)
      this.ch = null;
    else
      this.ch = this.input[this.readPosition];

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  peekChar() {
    if (this.readPosition >= this.input.length)
      return null;
    else
      return this.input[this.readPosition];
  }  

  nextToken() {
    let token;

    this.skipWhitespace();
    
    switch(this.ch) {
      case '=':
        if (this.peekChar() === "=") {
          this.readChar();
          token = newToken(tokenType.EQ, "==");
        }
        else{
          token = newToken(tokenType.ASSIGN, this.ch);
        }
        break;

      case '+':
        token = newToken(tokenType.PLUS, this.ch);
        break;

      case '-':
        token = newToken(tokenType.MINUS, this.ch);
        break;

      case '!':
        if (this.peekChar() === "=") {
          this.readChar();
          token = newToken(tokenType.NOT_EQ, "!=");
        }
        else {
          token = newToken(tokenType.BANG, this.ch);
        }
        break;

      case '*':
        token = newToken(tokenType.ASTERISK, this.ch);
        break;

      case '/':
        token = newToken(tokenType.SLASH, this.ch);
        break;

      case '<':
        token = newToken(tokenType.LT, this.ch);
        break;

      case '>':
        token = newToken(tokenType.GT, this.ch);
        break;

      case ',':
        token = newToken(tokenType.COMMA, this.ch);
        break;

      case ';':
        token = newToken(tokenType.SEMICOLON, this.ch);
        break;

      case ':':
        token = newToken(tokenType.COLON, this.ch);
        break;

      case '(':
        token = newToken(tokenType.LPAREN, this.ch);
        break;

      case ')':
        token = newToken(tokenType.RPAREN, this.ch);
        break;

      case '{':
        token = newToken(tokenType.LBRACE, this.ch);
        break;

      case '}':
        token = newToken(tokenType.RBRACE, this.ch);
        break;

      case '[':
        token = newToken(tokenType.LBRACKET, this.ch);
        break;

      case ']':
        token = newToken(tokenType.RBRACKET, this.ch);
        break;

      case '"':
        token = newToken(tokenType.STRING, this.readString());
        break;

      case null:
        token = newToken(tokenType.EOF, "");
        break;

      default:
        if (isLetter(this.ch)) {
          let literal = this.readIdentifier();
          let type = Token.lookupIdent(literal);
          return newToken(type, literal);
        }

        else if (isDigit(this.ch)) {
          let type = tokenType.INT;
          let literal = this.readNumber();
          return newToken(type, literal);
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
    while (isLetter(this.ch))   this.readChar();

    return this.input.slice(position, this.position);
  }

  readNumber() {
    let position = this.position;
    while (isDigit(this.ch))  this.readChar();

    return this.input.slice(position, this.position);
  }

  readString() {
    let position = this.position + 1;
    do {
      this.readChar();
    } while (this.ch !== '"' && this.ch !== null);

    return this.input.slice(position, this.position);
  }
}


function newToken(tokenType, literal) {
  return {type: tokenType, literal: literal};
}

function isLetter(char) { return /^[a-zA-Z_]$/.test(char); }
function isDigit(char) {  return /^[0-9]$/.test(char); }


module.exports = Lexer;
