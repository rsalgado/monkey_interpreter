
const objectType = {
  INTEGER_OBJ: "INTEGER",
  BOOLEAN_OBJ: "BOOLEAN",
  STRING_OBJ: "STRING",
  NULL_OBJ: "NULL",
  RETURN_VALUE_OBJ: "RETURN_VALUE",
  ERROR_OBJ: "ERROR",
  FUNCTION_OBJ: "FUNCTION",
  BUILTIN_OBJ: "BUILTIN",
  ARRAY_OBJ: "ARRAY",
};


class Integer {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.INTEGER_OBJ; }
  inspect() { return `${this.value}`; }
}

class Boolean {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.BOOLEAN_OBJ; }
  inspect() { return `${this.value}`; }
}

class String {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.STRING_OBJ; }
  inspect() { return `${this.value}`; }
}

class Null {
  type() { return objectType.NULL_OBJ; }
  inspect() { return "null"; }
}

class ReturnValue {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.RETURN_VALUE_OBJ; }
  inspect() { return this.value.inspect(); }
}

class Error {
  constructor(message) {
    this.message = message;
  }

  type() { return objectType.ERROR_OBJ; }
  inspect() { return `ERROR: ${this.message}`; }
}

class Function {
  constructor(parameters = [], body = null, env = null) {
    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  type() { return objectType.FUNCTION_OBJ; }
  inspect() {
    return `fn(${this.parameters.join(",")}) { 
  ${this.body}
}`;
  }
}

class Array {
  constructor(elements = []) {
    this.elements = elements;
  }

  type() { return objectType.ARRAY_OBJ; }
  inspect() {
    let elements = this.elements.map(el => el.inspect()); 
    return `[${elements.join(", ")}]`; 
  }
}

class Builtin {
  constructor(fn) {
    this.fn = fn;
  }

  type() { return objectType.BUILTIN_OBJ; }
  inspect() { return "builtin function"; }
}


module.exports = {
  objectType,
  Integer,
  Boolean,
  String,
  Null,
  ReturnValue,
  Error,
  Function,
  Builtin,
  Array,
};
