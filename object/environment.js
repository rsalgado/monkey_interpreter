
class Environment {
  constructor(store = {}) {
    this.store = store;
  }

  get(name) {
    return this.store[name];
  }

  set(name, value) {
    this.store[name] = value;
    return value;
  }
}

module.exports = Environment;
