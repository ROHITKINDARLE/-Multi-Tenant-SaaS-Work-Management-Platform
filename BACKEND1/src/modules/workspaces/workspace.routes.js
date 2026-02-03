const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const rbacMiddleware = require('../../middlewares/rbac.middleware');
const workspaceController = require('./workspace.controller');

// Create workspace (Admin & Manager only)
router.post(
  '/',
  authMiddleware,
  rbacMiddleware(['Admin', 'Manager']),
  workspaceController.createWorkspace
);

// List workspaces (any authenticated user)
router.get(
  '/',
  authMiddleware,
  workspaceController.getWorkspaces
);

module.exports = router;
