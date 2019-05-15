
const objectType = {
  INTEGER_OBJ: "INTEGER",
  BOOLEAN_OBJ: "BOOLEAN",
  NULL_OBJ: "NULL",
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

module.exports = {
  objectType,
  Integer,
  Boolean,
  Null,
};
