const express = require('express');
const cors = require('cors');

const authMiddleware = require('./middlewares/auth.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const workspaceRoutes = require('./modules/workspaces/workspace.routes');
const projectRoutes = require('./modules/projects/project.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const workflowRoutes = require('./modules/workflows/workflow.routes');
const transitionRoutes = require('./modules/workflows/transition.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const automationRoutes = require('./modules/automations/automation.routes');
const userRoutes = require('./modules/users/user.routes');

const app = express();

// --------------------
// Global Middlewares
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// Health Check
// --------------------
app.get('/health', (req, res) => {
  res.send('OK');
});

// --------------------
// API Routes
// --------------------
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use(authMiddleware);

app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/api/workflows', require('./modules/workflows/workflow.routes'));
app.use('/api/workflows/transitions', require('./modules/workflows/transition.routes'));

app.use('/api/analytics', analyticsRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/users', userRoutes);

// --------------------
// Protected Test Route
// --------------------
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user
  });
});

// --------------------
// Global Error Handler
// --------------------
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;
