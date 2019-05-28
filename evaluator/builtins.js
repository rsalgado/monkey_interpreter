const object = require("../object/object");


let builtins = {
  "len": new object.Builtin(args => {
    if (args.length !== 1) {
      // Note: I don't use evaluator's `newError` here because it would cause a circular dependency.
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    let arg = args[0];
    if (arg instanceof object.String) {
      // Note: I don't use evaluator's `newError` here because it would cause a circular dependency.
      return new object.Integer(arg.value.length);
    }

    return new object.Error(`argument to \`len\` not supported, got ${arg.type()}`);
  }),
};

module.exports = builtins;
