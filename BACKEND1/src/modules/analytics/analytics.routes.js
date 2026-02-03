const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const analyticsController = require('./analytics.controller');

router.get(
  '/delay-risk',
  auth,
  rbac('Admin', 'Manager'),
  analyticsController.getDelayRisk
);

router.get(
  '/workflow-efficiency',
  auth,
  rbac('Admin', 'Manager'),
  analyticsController.workflowEfficiency
);

router.get(
  '/workload',
  auth,
  rbac('Admin', 'Manager'),
  analyticsController.userWorkload
);

module.exports = router;
