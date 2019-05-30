const ast = require('../ast/ast');
const object = require('../object/object');
const objectType = object.objectType;
const newEnclosedEnvironment = require('../object/environment').newEnclosedEnvironment;
const builtins = require("./builtins");

const TRUE = new object.Boolean(true);
const FALSE = new object.Boolean(false);
const NULL = new object.Null();


function evaluate(astNode, environment) {
  if (astNode instanceof ast.Program)
    return evalProgram(astNode.statements, environment);

  if (astNode instanceof ast.BlockStatement)
    return evalBlockStatement(astNode, environment);

  if (astNode instanceof ast.ExpressionStatement)
    return evaluate(astNode.expression, environment);

  if (astNode instanceof ast.IntegerLiteral)
    return new object.Integer(astNode.value);

  if (astNode instanceof ast.Boolean)
    return nativeBoolToBooleanObject(astNode.value);

  if (astNode instanceof ast.StringLiteral) {
    return new object.String(astNode.value);
  }

  if (astNode instanceof ast.PrefixExpression) {
    let right = evaluate(astNode.right, environment);
    if (isError(right))
      return right;
    return evalPrefixExpression(astNode.operator, right);
  }

  if (astNode instanceof ast.InfixExpression) {
    let left = evaluate(astNode.left, environment);
    if (isError(left))
      return left;

    let right = evaluate(astNode.right, environment);
    if (isError(right))
      return right;

    return evalInfixExpression(astNode.operator, left, right);
  }

  if (astNode instanceof ast.IfExpression)
    return evalIfExpression(astNode, environment);

  if (astNode instanceof ast.ReturnStatement) {
    let value = evaluate(astNode.returnValue, environment);
    if (isError(value))
      return value;
    return new object.ReturnValue(value);
  }

  if (astNode instanceof ast.LetStatement) {
    let value = evaluate(astNode.value, environment);
    if (isError(value))
      return value;

    environment.set(astNode.name.value, value);
  }

  if (astNode instanceof ast.Identifier)
    return evalIdentifier(astNode, environment);

  if (astNode instanceof ast.FunctionLiteral) {
    let params = astNode.parameters;
    let body = astNode.body;

    return new object.Function(params, body, environment);
  }

  if (astNode instanceof ast.CallExpression) {
    let funcObj = evaluate(astNode.func, environment);
    if (isError(funcObj))
      return funcObj;

    let args = evalExpressions(astNode.args, environment);
    if (args.length === 1 && isError(args[0]))
      return args[0];

    return applyFunction(funcObj, args);
  }

  if (astNode instanceof ast.ArrayLiteral) {
    let elements = evalExpressions(astNode.elements, environment);
    if (elements.length === 1 && isError(elements[0]))
      return elements[0];

    return new object.Array(elements);
  }

  if (astNode instanceof ast.IndexExpression) {
    let left = evaluate(astNode.left, environment);
    if (isError(left))  return left;

    let index = evaluate(astNode.index, environment);
    if (isError(index)) return index;

    return evalIndexExpression(left, index);
  }


  return null;
}

function evalProgram(statements, environment) {
  let result = null;
  
  for (let statement of statements) {
    result = evaluate(statement, environment);

    if (result instanceof object.ReturnValue)
      return result.value;
    if (result instanceof object.Error)
      return result;
  }

  return result;
}

function evalBlockStatement(block, environment) {
  let result = null;

  for (let statement of block.statements) {
    result = evaluate(statement, environment);

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

  if (leftObject.type() === objectType.STRING_OBJ && rightObject.type() === objectType.STRING_OBJ)
    return evalStringInfixExpression(operator, leftObject, rightObject);

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

function evalStringInfixExpression(operator, leftObject, rightObject) {
  if (operator !== "+")   return newError(`unknown operator: ${leftObject.type()} ${operator} ${rightObject.type()}`);

  let leftVal = leftObject.value;
  let rightVal = rightObject.value;
  return new object.String(leftVal + rightVal);
}

function evalIfExpression(ifExpression, environment) {
  let condition = evaluate(ifExpression.condition, environment);
  if (isError(condition))
    return condition;

  if (isTruthy(condition))
    return evaluate(ifExpression.consequence, environment);

  else if (ifExpression.alternative !== null)
    return evaluate(ifExpression.alternative, environment);

  else
    return NULL;
}

function evalIdentifier(identifierNode, environment) {
  let value = environment.get(identifierNode.value);
  if (value)
    return value;
  else if (builtins[identifierNode.value])
    return builtins[identifierNode.value];
  else
    return newError(`identifier not found: ${identifierNode.value}`);
}

function evalIndexExpression(leftObject, indexObject) {
  if (leftObject.type() === objectType.ARRAY_OBJ && indexObject.type() === objectType.INTEGER_OBJ) {
    return evalArrayIndexExpresion(leftObject, indexObject);
  }

  return newError(`index operator not supported: ${leftObject.type()}`);
}

function evalArrayIndexExpresion(arrayObject, indexObject) {
  let index = indexObject.value;
  let max = arrayObject.elements.length - 1;

  if (index < 0 || index > max)   return NULL;

  return arrayObject.elements[index];
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

function isError(obj) {
  if (obj) {
    return obj.type() === object.ERROR_OBJ;
  }
  return false;
}

function evalExpressions(expressions, environment) {
  let result = [];

  for (let expression of expressions) {
    let evaluated = evaluate(expression, environment);
    if (isError(evaluated))
      return [evaluated];

    result.push(evaluated);
  }

  return result;
}

function applyFunction(fn, args) {
  if (fn instanceof object.Function) {
    let extendedEnv = extendFunctionEnv(fn, args);
    let evaluated = evaluate(fn.body, extendedEnv);
    return unwrapReturnValue(evaluated);    
  }

  if (fn instanceof object.Builtin) {
    return fn.fn(args);
  }

  return newError(`not a function: ${fn.type()}`);
}

function extendFunctionEnv(fn, args) {
  let env = newEnclosedEnvironment(fn.env);

  for (let i = 0; i < fn.parameters.length; i++) {
    let param = fn.parameters[i];
    env.set(param.value, args[i]);
  }

  return env;
}

function unwrapReturnValue(obj) {
  if (obj instanceof object.ReturnValue)
    return obj.value;

  return obj;
}

module.exports = {
  evaluate,
  newError,
}
