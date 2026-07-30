class BaseProvider {
  constructor(name) {
    if (this.constructor === BaseProvider) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.name = name;
  }

  async generate(prompt) {
    throw new Error("Method 'generate()' must be implemented.");
  }

  async chat(messages) {
    throw new Error("Method 'chat()' must be implemented.");
  }

  async stream(prompt, callback) {
    throw new Error("Method 'stream()' must be implemented.");
  }

  async embeddings(text) {
    throw new Error("Method 'embeddings()' must be implemented.");
  }

  async health() {
    throw new Error("Method 'health()' must be implemented.");
  }
}

module.exports = BaseProvider;
