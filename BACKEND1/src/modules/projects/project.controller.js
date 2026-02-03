const projectService = require('./project.service');

exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject({
      organizationId: req.user.organizationId,
      ownerId: req.user.userId,
      workspaceId: req.body.workspaceId,
      name: req.body.name,
      description: req.body.description,
      deadline: req.body.deadline
    });

    res.status(201).json({
      message: 'Project created',
      data: project
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProjectsByWorkspace = async (req, res) => {
  try {
    const projects = await projectService.getProjectsByWorkspace(
      req.user.organizationId,
      req.params.workspaceId
    );

    res.json({ data: projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(
      req.params.projectId,
      req.user.organizationId,
      req.body
    );

    res.json({
      message: 'Project updated',
      data: project
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
