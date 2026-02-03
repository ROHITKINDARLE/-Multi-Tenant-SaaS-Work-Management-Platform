const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const rbacMiddleware = require('../../middlewares/rbac.middleware');
const workflowController = require('./workflow.controller');

/* ---------------------------
   CREATE WORKFLOW (Admin)
---------------------------- */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware(['Admin']),
  workflowController.createWorkflow
);

/* ---------------------------
   GET ALL WORKFLOWS (Admin)
---------------------------- */
router.get(
  '/',
  authMiddleware,
  rbacMiddleware(['Admin']),
  workflowController.getAllWorkflows
);

/* ---------------------------
   GET ALL WORKFLOW STATES
---------------------------- */
router.get(
  '/states/all',
  authMiddleware,
  workflowController.getAllStates
);

/* ---------------------------
   GET WORKFLOW TRANSITIONS
---------------------------- */
router.get(
  '/transitions',
  authMiddleware,
  workflowController.getTransitions
);

/* ---------------------------
   ADD STATE TO WORKFLOW
---------------------------- */
router.post(
  '/:workflowId/states',
  authMiddleware,
  rbacMiddleware(['Admin']),
  workflowController.addState
);

/* ---------------------------
   GET WORKFLOW BY ID
---------------------------- */
router.get(
  '/:workflowId',
  authMiddleware,
  workflowController.getWorkflow
);

module.exports = router;
