const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const rbacMiddleware = require('../../middlewares/rbac.middleware');
const projectController = require('./project.controller');

// Create project (Admin, Manager)
router.post(
  '/',
  authMiddleware,
  rbacMiddleware(['Admin', 'Manager']),
  projectController.createProject
);

// List projects in a workspace (all roles)
router.get(
  '/workspace/:workspaceId',
  authMiddleware,
  projectController.getProjectsByWorkspace
);

// Update project (Admin, Manager)
router.put(
  '/:projectId',
  authMiddleware,
  rbacMiddleware(['Admin', 'Manager']),
  projectController.updateProject
);

module.exports = router;
