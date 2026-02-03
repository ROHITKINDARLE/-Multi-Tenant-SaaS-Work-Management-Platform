const pool = require('../../config/db');
const { sendNotification } = require('./notification.service');

exports.escalateTask = async (task, organizationId) => {
  // 1️⃣ Increase priority (max = 4)
  await pool.query(
    `
    UPDATE tasks
    SET priority = LEAST(priority + 1, 4)
    WHERE id = $1 AND organization_id = $2
    `,
    [task.id, organizationId]
  );

  // 2️⃣ Insert audit log (UUID-safe)
  await pool.query(
    `
    INSERT INTO task_activity_logs (
      id,
      task_id,
      organization_id,
      action,
      new_value,
      metadata
    )
    VALUES (
      gen_random_uuid(),
      $1,
      $2,
      'auto_escalation',
      NULL,
      'priority_increased'
    )
    `,
    [task.id, organizationId]
  );

  // 3️⃣ Send notification (decoupled)
  await sendNotification({
    type: 'webhook',
    payload: {
      event: 'TASK_ESCALATED',
      taskId: task.id,
      title: task.title,
      newPriority: Math.min(task.priority + 1, 4),
      organizationId
    }
  });
};
