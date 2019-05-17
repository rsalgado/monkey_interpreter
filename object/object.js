
const objectType = {
  INTEGER_OBJ: "INTEGER",
  BOOLEAN_OBJ: "BOOLEAN",
  NULL_OBJ: "NULL",
  RETURN_VALUE_OBJ: "RETURN_VALUE",
  ERROR_OBJ: "ERROR",
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

module.exports = {
  objectType,
  Integer,
  Boolean,
  Null,
  ReturnValue,
  Error,
};
