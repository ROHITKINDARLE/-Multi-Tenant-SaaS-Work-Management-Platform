const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const controller = require('./automation.controller');

// Task detection endpoints (must be before /:id to avoid matching)
router.get('/stuck', auth, controller.getStuckTasks);
router.get('/overdue', auth, controller.getOverdueTasks);

// 🔒 Admin-only escalation
router.post(
  '/escalate',
  auth,
  rbac('Admin'),
  controller.runEscalations
);

// 🔒 Admin-only CRUD operations (after specific routes)
router.get('/', auth, rbac('Admin'), controller.listAutomations);
router.post('/', auth, rbac('Admin'), controller.createAutomation);
router.put('/:id', auth, rbac('Admin'), controller.updateAutomation);
router.delete('/:id', auth, rbac('Admin'), controller.deleteAutomation);

module.exports = router;
