const object = require("../object/object");
const objectType = object.objectType;


let builtins = {
  "len": new object.Builtin(args => {
    if (args.length !== 1) {
      // Note: I don't use evaluator's `newError` here because it would cause a circular dependency.
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    let arg = args[0];

    if (arg instanceof object.String)
      return new object.Integer(arg.value.length);

    if (arg instanceof object.Array)
      return new object.Integer(arg.elements.length);

    // Note: I don't use evaluator's `newError` here because it would cause a circular dependency.
    return new object.Error(`argument to \`len\` not supported, got ${arg.type()}`);
  }),

  "first": new object.Builtin(args => {
    if (args.length !== 1)
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);

    let arg = args[0];

    if (arg.type() !== objectType.ARRAY_OBJ) {
      // Note: I don't use evaluator's `newError` here because it would cause a circular dependency.
      return new object.Error(`argument to \`first\` must be ARRAY, got ${arg.type()}`);
    }

    if (arg.elements.length > 0)
      return arg.elements[0];

    // Note: I don't use evaluator's NULL here because it would cause a circular dependency.
    return new object.Null();
  }),

  "last": new object.Builtin(args => {
    if (args.length !== 1)
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);

    let arg = args[0];

    if (arg.type() !== objectType.ARRAY_OBJ)
      return new object.Error(`argument to \`last\` must be ARRAY, got ${arg.type()}`);

    let length = arg.elements.length;
    if (length > 0)
      return arg.elements[length - 1];

    return new object.Null();
  }),

  "rest": new object.Builtin(args => {
    if (args.length !== 1)
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);

    let arg = args[0];

    if (arg.type() !== objectType.ARRAY_OBJ)
      return new object.Error(`argument to \`rest\` must be ARRAY, got ${arg.type()}`);

    let arrObject = arg;
    let length = arrObject.elements.length;
    if (length > 0) {
      let newElements = arrObject.elements.slice(1);
      return new object.Array(newElements);
    }

    return new object.Null();
  }),

  "push": new object.Builtin(args => {
    if (args.length !== 2)
      return new object.Error(`wrong number of arguments. got=${arg.length}, want=2`);

    let arrObject = args[0];
    if (arrObject.type() !== objectType.ARRAY_OBJ)
      return new object.Error(`argument to \`push\` must be ARRAY, got ${arrObject.type()}`);

    let newElements = arrObject.elements.slice(0);
    newElements.push(args[1]);

    return new object.Array(newElements);
  }),

  "puts": new object.Builtin(args => {
    args.forEach(arg => 
      console.log(arg.inspect())
    );
    return new object.Null();
  }),

};

module.exports = builtins;
