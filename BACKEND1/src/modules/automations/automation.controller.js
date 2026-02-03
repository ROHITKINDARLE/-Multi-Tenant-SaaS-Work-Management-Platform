const automationService = require('./automation.service');
const escalationService = require('./escalation.service');

/* --------------------------------
   GET STUCK TASKS
--------------------------------- */
exports.getStuckTasks = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const tasks = await automationService.findStuckTasks(
      organizationId,
      req.query.hours || 24
    );

    res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------
   GET OVERDUE TASKS
--------------------------------- */
exports.getOverdueTasks = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const tasks = await automationService.findOverdueTasks(organizationId);

    res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------
   RUN AUTO-ESCALATION
--------------------------------- */
exports.runEscalations = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const stuckTasks = await automationService.findStuckTasks(
      organizationId,
      24
    );

    for (const task of stuckTasks) {
      // ✅ PASS FULL TASK OBJECT
      await escalationService.escalateTask(task, organizationId);
    }

    res.json({
      message: 'Escalation executed',
      affected: stuckTasks.length
    });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------
   LIST AUTOMATIONS
--------------------------------- */
exports.listAutomations = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const automations = await automationService.listAutomations(organizationId);

    res.json({ data: automations });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------
   CREATE AUTOMATION
--------------------------------- */
exports.createAutomation = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { name, description, type, enabled, trigger, action } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: 'Name and type are required',
      });
    }

    const automation = await automationService.createAutomation(
      organizationId,
      {
        name,
        description,
        type,
        enabled: enabled !== false,
        trigger,
        action,
      }
    );

    res.status(201).json({ data: automation });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------
   UPDATE AUTOMATION
--------------------------------- */
exports.updateAutomation = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { id } = req.params;
    const { name, description, type, enabled, trigger, action } = req.body;

    const automation = await automationService.updateAutomation(
      id,
      organizationId,
      {
        name,
        description,
        type,
        enabled,
        trigger,
        action,
      }
    );

    res.json({ data: automation });
  } catch (err) {
    if (err.message === 'Automation not found') {
      return res.status(404).json({ error: 'Automation not found' });
    }
    next(err);
  }
};

/* --------------------------------
   DELETE AUTOMATION
--------------------------------- */
exports.deleteAutomation = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { id } = req.params;

    await automationService.deleteAutomation(id, organizationId);

    res.json({ message: 'Automation deleted' });
  } catch (err) {
    if (err.message === 'Automation not found') {
      return res.status(404).json({ error: 'Automation not found' });
    }
    next(err);
  }
};
