const ExecutionManager = require('./ExecutionManager');

class WorkflowEngine {
  /**
   * Public entry point for triggering a multi-agent orchestration
   */
  static async run(intent, context) {
    return await ExecutionManager.runWorkflow(intent, context);
  }
}

module.exports = WorkflowEngine;
