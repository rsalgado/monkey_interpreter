const ast  = require('../ast/ast');
const object = require('../object/object');
const objectType = object.objectType;


const TRUE = new object.Boolean(true);
const FALSE = new object.Boolean(false);
const NULL = new object.Null();


function evaluate(astNode) {
  if (astNode instanceof ast.Program)
    return evalProgram(astNode.statements);

  if (astNode instanceof ast.BlockStatement)
    return evalBlockStatement(astNode);

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

  if (astNode instanceof ast.InfixExpression) {
    let left = evaluate(astNode.left);
    let right = evaluate(astNode.right);
    return evalInfixExpression(astNode.operator, left, right);
  }

  if (astNode instanceof ast.BlockStatement)
    return evalStatements(astNode.statements);

  if (astNode instanceof ast.IfExpression)
    return evalIfExpression(astNode);

  if (astNode instanceof ast.ReturnStatement) {
    let value = evaluate(astNode.returnValue);
    return new object.ReturnValue(value);
  }


  return null;
}

function evalProgram(statements) {
  let result;
  
  for (let statement of statements) {
    result = evaluate(statement);

    if (result instanceof object.ReturnValue)
      return result.value;
    if (result instanceof object.Error)
      return result;
  }

  return result;
}

function evalBlockStatement(block) {
  let result = null;

  for (let statement of block.statements) {
    result = evaluate(statement);

    if (result !== null) {
      let resultType = result.type();
      if (resultType === objectType.RETURN_VALUE_OBJ || resultType === objectType.ERROR_OBJ)
        return result;
    }
  }

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
      return newError(`unknown operator: ${operator}${rightObject.type()}`);
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
  if (rightObject.type() !== objectType.INTEGER_OBJ)
    return newError(`unknown operator: -${rightObject.type()}`);

  let value = rightObject.value;
  return new object.Integer(-value);
}

function evalInfixExpression(operator, leftObject, rightObject) {
  if (leftObject.type() === objectType.INTEGER_OBJ && rightObject.type() === objectType.INTEGER_OBJ)
    return evalIntegerInfixExpression(operator, leftObject, rightObject);

  if (leftObject.type() !== rightObject.type())
    return newError(`type mismatch: ${leftObject.type()} ${operator} ${rightObject.type()}`);

  // Assuming that the values are booleans, we compare them directly as all point to the same constants
  if (operator === "==")
    return nativeBoolToBooleanObject(leftObject === rightObject);
  if (operator === "!=")
    return nativeBoolToBooleanObject(leftObject !== rightObject);

  return newError(`unknown operator: ${leftObject.type()} ${operator} ${rightObject.type()}`);
}

function evalIntegerInfixExpression(operator, leftObject, rightObject) {
  let leftVal = leftObject.value;
  let rightVal = rightObject.value;

  switch (operator) {
    case "+":
      return new object.Integer(leftVal + rightVal);
    case "-":
      return new object.Integer(leftVal - rightVal);
    case "*":
      return new object.Integer(leftVal * rightVal);
    case "/":
      return new object.Integer((leftVal / rightVal)|0);
    case "<":
      return new nativeBoolToBooleanObject(leftVal < rightVal);
    case ">":
      return new nativeBoolToBooleanObject(leftVal > rightVal);
    case "==":
      return new nativeBoolToBooleanObject(leftVal === rightVal);
    case "!=":
      return new nativeBoolToBooleanObject(leftVal !== rightVal);
    default:
      return newError(`unknown operator: ${leftObject.type()} ${operator} ${rightObject.type()}`);
  }
}

function evalIfExpression(ifExpression) {
  let condition = evaluate(ifExpression.condition);

  if (isTruthy(condition))
    return evaluate(ifExpression.consequence);

  else if (ifExpression.alternative !== null)
    return evaluate(ifExpression.alternative);

  else
    return NULL;
}

function isTruthy(conditionObject) {
  switch (conditionObject) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
}

function newError(message) {
  return new object.Error(message);
}

module.exports = {
  evaluate,
}
