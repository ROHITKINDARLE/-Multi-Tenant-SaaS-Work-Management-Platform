const pool = require('../../config/db');

const toPriorityNumber = (priority) => {
  if (typeof priority === 'number') return priority;
  switch ((priority || '').toLowerCase()) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    case 'critical':
      return 4;
    default:
      return 2;
  }
};

const toPriorityLabel = (priority) => {
  if (typeof priority === 'string') return priority.toLowerCase();
  switch (priority) {
    case 1:
      return 'low';
    case 2:
      return 'medium';
    case 3:
      return 'high';
    case 4:
      return 'critical';
    default:
      return 'medium';
  }
};

const createTask = async ({
  organizationId,
  projectId,
  title,
  description,
  assignedTo,
  dueDate,
  priority,
  status
}) => {
  // 🔐 Ensure project belongs to same organization
  const projectCheck = await pool.query(
    `SELECT id FROM projects
     WHERE id = $1 AND organization_id = $2`,
    [projectId, organizationId]
  );

  if (projectCheck.rows.length === 0) {
    throw new Error('Invalid project access');
  }

  const result = await pool.query(
    `INSERT INTO tasks
     (project_id, organization_id, title, description, assigned_to, due_date, priority, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, status, assigned_to, due_date, priority, created_at`,
    [
      projectId,
      organizationId,
      title,
      description,
      assignedTo,
      dueDate,
      toPriorityNumber(priority),
      status
    ]
  );

  const task = result.rows[0];
  return { ...task, priority: toPriorityLabel(task.priority) };
};

const getTasksByProject = async (organizationId, projectId) => {
  const result = await pool.query(
    `SELECT id, title, status, assigned_to, due_date, priority, created_at
     FROM tasks
     WHERE organization_id = $1 AND project_id = $2
     ORDER BY created_at DESC`,
    [organizationId, projectId]
  );

  return result.rows.map((row) => ({
    ...row,
    priority: toPriorityLabel(row.priority),
  }));
};

const updateTaskStatus = async ({
  organizationId,
  taskId,
  newStatus,
  performedBy
}) => {
  // 1️⃣ Get task + current status
  const taskRes = await pool.query(
    `SELECT t.status, p.id AS project_id
     FROM tasks t
     JOIN projects p ON p.id = t.project_id
     WHERE t.id = $1 AND t.organization_id = $2`,
    [taskId, organizationId]
  );

  if (taskRes.rows.length === 0) {
    throw new Error('Task not found');
  }

  let oldStatus = taskRes.rows[0].status;
  const projectId = taskRes.rows[0].project_id;

  // 2️⃣ Get workflow attached to project (assume 1 workflow for now)
  const wfRes = await pool.query(
    `SELECT w.id
     FROM workflows w
     WHERE w.organization_id = $1
     LIMIT 1`,
    [organizationId]
  );

  if (wfRes.rows.length === 0) {
    throw new Error('No workflow configured');
  }

  const workflowId = wfRes.rows[0].id;

  // 2.5️⃣ Map legacy status names to workflow state IDs
  const statesRes = await pool.query(
    `SELECT id, name FROM workflow_states WHERE workflow_id = $1`,
    [workflowId]
  );

  const states = statesRes.rows || [];
  const byId = new Set(states.map((s) => s.id));
  const normalize = (val) => (val || '').toString().replace(/_/g, ' ').toLowerCase();
  const findByName = (val) => states.find((s) => s.name.toLowerCase() === normalize(val));

  if (oldStatus && !byId.has(oldStatus)) {
    const matched = findByName(oldStatus);
    if (matched) oldStatus = matched.id;
  }

  let mappedNewStatus = newStatus;
  if (mappedNewStatus && !byId.has(mappedNewStatus)) {
    const matched = findByName(mappedNewStatus);
    if (matched) mappedNewStatus = matched.id;
  }

  // 3️⃣ Validate transition
  const transitionCheck = await pool.query(
    `SELECT 1 FROM workflow_transitions
     WHERE workflow_id = $1
       AND from_state = $2
       AND to_state = $3`,
    [workflowId, oldStatus, mappedNewStatus]
  );
  if (transitionCheck.rows.length === 0) {
    const anyTransitions = await pool.query(
      `SELECT 1 FROM workflow_transitions WHERE workflow_id = $1 LIMIT 1`,
      [workflowId]
    );
    if (anyTransitions.rows.length > 0) {
      throw new Error(`Invalid transition: ${oldStatus} → ${mappedNewStatus}`);
    }
  }

  // 4️⃣ Update task
  const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2 AND organization_id = $3
     RETURNING id, title, status`,
    [mappedNewStatus, taskId, organizationId]
  );

  // 5️⃣ Log activity
  await pool.query(
    `INSERT INTO task_activity_logs
     (task_id, organization_id, action, old_value, new_value, performed_by)
     VALUES ($1, $2, 'status_change', $3, $4, $5)`,
    [taskId, organizationId, oldStatus, mappedNewStatus, performedBy]
  );

  return result.rows[0];
};


module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus
};
