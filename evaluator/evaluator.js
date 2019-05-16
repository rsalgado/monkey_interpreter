const ast  = require('../ast/ast');
const object = require('../object/object');
const objectType = object.objectType;


const TRUE = new object.Boolean(true);
const FALSE = new object.Boolean(false);
const NULL = new object.Null();


function evaluate(astNode) {
  if (astNode instanceof ast.Program)
    return evalStatements(astNode.statements);

  if (astNode instanceof ast.ExpressionStatement)
    return evaluate(astNode.expression);

  if (astNode instanceof ast.IntegerLiteral)
    return new object.Integer(astNode.value);

  if (astNode instanceof ast.Boolean)
    return nativeBoolToBooleanObject(astNode.value);

  if (astNode instanceof ast.PrefixExpression) {
    let right = evaluate(astNode.right);
    return evalPrefixExpression(astNode.operator, right);
  }

  return null;
}

function evalStatements(statements) {
  let result;
  
  statements.forEach(statement => {
    result = evaluate(statement);
  });

  return result;
}

function nativeBoolToBooleanObject(value) {
  if (value)  return TRUE;
  return FALSE;
}

function evalPrefixExpression(operator, rightObject) {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(rightObject);
    case "-":
      return evalMinusPrefixOperatorExpression(rightObject);
    default:
      return NULL;
  }
}

function evalBangOperatorExpression(rightObject) {
  switch (rightObject) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression(rightObject) {
  if (rightObject.type() !== objectType.INTEGER_OBJ)   return NULL;

  let value = rightObject.value;
  return new object.Integer(-value);
}


module.exports = {
  evaluate,
}
