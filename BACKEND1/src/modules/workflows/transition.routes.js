const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const rbacMiddleware = require('../../middlewares/rbac.middleware');
const transitionController = require('./transition.controller');

router.post(
  '/',
  authMiddleware,
  rbacMiddleware(['Admin']),
  transitionController.addTransition
);

router.get(
  '/',
  authMiddleware,
  rbacMiddleware(['Admin']),
  transitionController.getTransitions
);

module.exports = router;
