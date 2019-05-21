
class Environment {
  constructor(store = {}) {
    this.store = store;
    this.outer = null;
  }

  get(name) {
    let result = this.store[name];

    if (result)
      return result;
    if (this.outer)
      return this.outer.get(name);
  }

  set(name, value) {
    this.store[name] = value;
    return value;
  }
}

function newEnclosedEnvironment(outer) {
  let env = new Environment();
  env.outer = outer;
  return env;
}

module.exports = {
  Environment,
  newEnclosedEnvironment,
};
