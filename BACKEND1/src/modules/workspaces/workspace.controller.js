const workspaceService = require('./workspace.service');

exports.createWorkspace = async (req, res) => {
  try {
    const workspace = await workspaceService.createWorkspace(
      req.user.organizationId,
      req.body.name
    );

    res.status(201).json({
      message: 'Workspace created',
      data: workspace
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspaceService.getWorkspaces(
      req.user.organizationId
    );

    res.json({ data: workspaces });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
