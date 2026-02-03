
const workflowService = require('./workflow.service');
const transitionService = require('./transition.service');

/* ---------------------------
   CREATE WORKFLOW
---------------------------- */
exports.createWorkflow = async (req, res) => {
  try {
    const workflow = await workflowService.createWorkflow(
      req.user.organizationId,
      req.body.name
    );

    res.status(201).json({ data: workflow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ---------------------------
   GET ALL WORKFLOWS
---------------------------- */
exports.getAllWorkflows = async (req, res) => {
  try {
    const workflows = await workflowService.getAllWorkflows(
      req.user.organizationId
    );

    res.json({ data: workflows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------------------
   ADD STATE
---------------------------- */
exports.addState = async (req, res) => {
  try {
    const state = await workflowService.addState({
      organizationId: req.user.organizationId,
      workflowId: req.params.workflowId,
      name: req.body.name,
      position: req.body.position
    });

    res.status(201).json({ data: state });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ---------------------------
   GET WORKFLOW BY ID
---------------------------- */
exports.getWorkflow = async (req, res) => {
  try {
    const workflow = await workflowService.getWorkflow(
      req.user.organizationId,
      req.params.workflowId
    );

    res.json({ data: workflow });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* ---------------------------
   GET WORKFLOW TRANSITIONS
---------------------------- */
exports.getTransitions = async (req, res) => {
  try {
    const transitions = await transitionService.getTransitions(
      req.user.organizationId
    );

    res.json({ data: transitions || [] });
  } catch (err) {
    console.error('getTransitions error:', err.message);
    res.json({ data: [] });
  }
};

/* ---------------------------
   GET ALL WORKFLOW STATES
---------------------------- */
exports.getAllStates = async (req, res) => {
  try {
    const states = await workflowService.getAllStates(
      req.user.organizationId
    );

    res.json({ data: states || [] });
  } catch (err) {
    console.error('getAllStates error:', err.message);
    res.json({ data: [] });
  }
};
