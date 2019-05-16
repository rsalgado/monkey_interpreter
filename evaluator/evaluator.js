const ast  = require('../ast/ast');
const object = require('../object/object');

function evaluate(astNode) {
  if (astNode instanceof ast.Program)
    return evalStatements(astNode.statements);

  if (astNode instanceof ast.ExpressionStatement)
    return evaluate(astNode.expression);

  if (astNode instanceof ast.IntegerLiteral)
    return new object.Integer(astNode.value);

  return null;
}

function evalStatements(statements) {
  let result;
  
  statements.forEach(statement => {
    result = evaluate(statement);
  });

  return result;
}

module.exports = {
  evaluate,
}
