const readline = require('readline');
const Lexer = require('../lexer/lexer');
const Token = require('../token/token');
const tokenType = Token.tokenTypes;


const PROMPT = ">> ";
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: PROMPT
});


rl.prompt();
rl.on("line", (line) => {
  let lexer = new Lexer(line);
  
  let token = lexer.nextToken();
  while(token.type !== tokenType.EOF) {
    console.log(token);
    token = lexer.nextToken();
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("Closing...");
  process.exit(0);
});
