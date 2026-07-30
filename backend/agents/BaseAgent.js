class BaseAgent {
  constructor(name, purpose) {
    if (this.constructor === BaseAgent) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.name = name;
    this.purpose = purpose;
  }

  /**
   * Execute the agent's primary task
   * @param {Object} context Context data including user intent and entities
   * @returns {Promise<Object>} Agent's response payload
   */
  async execute(context) {
    throw new Error("Method 'execute()' must be implemented.");
  }
}

module.exports = BaseAgent;
