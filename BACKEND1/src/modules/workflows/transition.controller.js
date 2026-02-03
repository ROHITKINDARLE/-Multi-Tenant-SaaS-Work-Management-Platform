const transitionService = require('./transition.service');

/* ---------------------------
   ADD TRANSITION
---------------------------- */
exports.addTransition = async (req, res) => {
  try {
    const transition = await transitionService.addTransition({
      organizationId: req.user.organizationId,
      workflowId: req.body.workflowId,
      fromStateId: req.body.fromStateId,
      toStateId: req.body.toStateId,
    });

    res.status(201).json({ data: transition });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ---------------------------
   GET TRANSITIONS
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
