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
    
  }
}


module.exports = Lexer;