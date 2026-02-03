const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const rbacMiddleware = require('../../middlewares/rbac.middleware');
const taskController = require('./task.controller');

// Create task (Admin, Manager, Contributor)
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('Admin', 'Manager', 'Contributor'),
  taskController.createTask
);

// Get tasks by project (all authenticated users)
router.get(
  '/project/:projectId',
  authMiddleware,
  taskController.getTasksByProject
);

// Update task status (Kanban move)
router.patch(
  '/:taskId/status',
  authMiddleware,
  rbacMiddleware('Admin', 'Manager', 'Contributor'),
  taskController.updateTaskStatus
);

module.exports = router;
