const taskService = require('./task.service');

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask({
      organizationId: req.user.organizationId,
      projectId: req.body.projectId,
      title: req.body.title,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      status: req.body.status
    });

    res.status(201).json({
      message: 'Task created',
      data: task
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(
      req.user.organizationId,
      req.params.projectId
    );

    res.json({ data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus({
      organizationId: req.user.organizationId,
      taskId: req.params.taskId,
      newStatus: req.body.status,
      performedBy: req.user.userId
    });

    res.json({
      message: 'Task status updated',
      data: task
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
