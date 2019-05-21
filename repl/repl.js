const readline = require('readline');
const Lexer = require('../lexer/lexer');
const Token = require('../token/token');
const Parser = require('../parser/parser');
const environment = require('../object/environment');
const evaluator = require('../evaluator/evaluator');



const MONKEY_FACE = `
            __,__
   .--.  .-"     "-.  .--.
  / .. \\/  .-. .-.  \\/ .. \\
 | |  '|  /   Y   \\  |'  | |
 | \\   \\  \\ 0 | 0 /  /   / |
  \\ '- ,\\.-"""""""-./, -' /
   ''-' /_   ^ ^   _\\ '-''
       |  \\._   _./  |
       \\   \\ '~' /   /
        '._ '-=-' _.'
           '-----'
`
const GREETING = `
Hello, this the Monkey programming language!
Feel free to type in commands
`;

const PROMPT = ">> ";


let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: PROMPT
});

let replEnv = new environment.Environment();

console.log(GREETING);
rl.prompt();


rl.on("line", (line) => {
  let lexer = new Lexer(line);
  let parser = new Parser(lexer);
  let program = parser.parseProgram();

  if (parser.errors.length !== 0) {
    printParserErrors(parser.errors);
  }
  else {
    let evaluated = evaluator.evaluate(program, replEnv);
    if (evaluated !== null)
      console.log(evaluated.inspect());
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("Closing...");
  process.exit(0);
});


function printParserErrors(errors) {
  let output = errors.map(msg => `\t${msg}`).join("\n");
  console.log(MONKEY_FACE);
  console.log("Woops! We ran into some monkey business here!");
  console.log("parser errors:");

  console.log(output, "\n");
}