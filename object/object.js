
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
  HASH_OBJ: "HASH",
};


class Integer {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.INTEGER_OBJ; }
  inspect() { return `${this.value}`; }

  hashKey() {
    return new HashKey(this.type(), this.value);
  }
}

class Boolean {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.BOOLEAN_OBJ; }
  inspect() { return `${this.value}`; }

  hashKey() {
    let value = null;

    if (this.value)
      value = 1;
    else
      value = 0;

    return new HashKey(this.type(), value);
  }
}

class String {
  constructor(value) {
    this.value = value;
  }

  type() { return objectType.STRING_OBJ; }
  inspect() { return `${this.value}`; }

  hashKey() {
    // This implementation of a hash was taken from: 
    // https://stackoverflow.com/a/7616484

    let hashVal = 0;

    for (let i = 0; i < this.value.length; i++) {
      let chr = this.value.charCodeAt(i);
      hashVal = ((hashVal << 5) - hashVal) + chr;
      hashVal |= 0;
    }

    return new HashKey(this.type(), hashVal);
  }
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

class HashKey {
  constructor(type = null, value = null) {
    this.type = type;
    this.value = value;
  }
}

class HashPair {
  constructor(key = null, value = null) {
    this.key = key;
    this.value = value;
  }
}

class Hash {
  constructor(pairs) {
    this.pairs = pairs;
  }

  type() { return objectType.HASH_OBJ; }
  inspect() {
    let pairs = Object.values(this.pairs)
                      .map(p => `${p.key.inspect()}: ${p.value.inspect()}`);

    return `{${pairs.join(", ")}}`;
  }
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
  HashPair,
  Hash,
};
