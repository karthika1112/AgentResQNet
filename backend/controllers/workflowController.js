const WorkflowEngine = require('../services/workflow/WorkflowEngine');

exports.runWorkflow = async (req, res, next) => {
  try {
    const { intent, context } = req.body;
    
    if (!intent) {
      return res.status(400).json({ success: false, message: 'Intent is required' });
    }

    const result = await WorkflowEngine.run(intent, context || {});
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkflowStatus = async (req, res, next) => {
  try {
    const { workflowId } = req.params;
    // In a real application, we would fetch this from a DB where ExecutionManager logs it.
    // For this step, we just return a stub or we could implement a quick in-memory store in ExecutionManager.
    res.status(200).json({
      success: true,
      message: 'Status tracking requires DB implementation (out of scope for this step)',
      workflowId
    });
  } catch (error) {
    next(error);
  }
};
