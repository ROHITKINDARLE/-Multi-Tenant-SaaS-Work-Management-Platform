const pool = require('../../config/db');

// Ensure automations table exists
const ensureAutomationsTable = async () => {
  try {
    // Drop existing table if it exists with wrong schema
    await pool.query(`DROP TABLE IF EXISTS automations CASCADE;`);
    
    // Create table with correct schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS automations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        trigger_config JSONB DEFAULT '{}',
        action_config JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_automations_org ON automations(organization_id);
      CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);
    `);
    console.log('✅ Automations table created successfully');
  } catch (err) {
    console.error('Failed to create automations table:', err);
  }
};

// Initialize table on module load
ensureAutomationsTable();

/**
 * Find tasks stuck in "In Progress"
 * Uses task_activity_logs instead of updated_at
 */
exports.findStuckTasks = async (organizationId, hours = 24) => {
  const result = await pool.query(
    `
    SELECT
      t.id,
      t.title,
      ws.name AS status,
      MAX(l.created_at) AS last_transition_at,
      EXTRACT(
        EPOCH FROM (NOW() - MAX(l.created_at))
      ) / 3600 AS hours_stuck
    FROM tasks t
    JOIN workflow_states ws ON ws.id = t.status
    JOIN task_activity_logs l ON l.task_id = t.id
    WHERE t.organization_id = $1
      AND ws.name = 'In Progress'
    GROUP BY t.id, t.title, ws.name
    HAVING MAX(l.created_at) < NOW() - INTERVAL '${hours} hours'
    ORDER BY hours_stuck DESC;
    `,
    [organizationId]
  );

  return result.rows;
};

/**
 * Find overdue tasks
 */
exports.findOverdueTasks = async (organizationId) => {
  const result = await pool.query(
    `
    SELECT
      t.id,
      t.title,
      t.due_date,
      ws.name AS status
    FROM tasks t
    LEFT JOIN workflow_states ws ON ws.id = t.status
    WHERE t.organization_id = $1
      AND t.due_date < NOW()
      AND ws.name != 'Done'
    ORDER BY t.due_date ASC;
    `,
    [organizationId]
  );

  return result.rows;
};

/**
 * List all automations for organization
 */
exports.listAutomations = async (organizationId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      description,
      type,
      enabled,
      trigger_config,
      action_config,
      created_at,
      updated_at
    FROM automations
    WHERE organization_id = $1
    ORDER BY created_at DESC;
    `,
    [organizationId]
  );

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    enabled: row.enabled,
    trigger: row.trigger_config,
    action: row.action_config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

/**
 * Get single automation by ID
 */
exports.getAutomation = async (id, organizationId) => {
  const result = await pool.query(
    `
    SELECT * FROM automations
    WHERE id = $1 AND organization_id = $2;
    `,
    [id, organizationId]
  );

  if (result.rows.length === 0) {
    throw new Error('Automation not found');
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    enabled: row.enabled,
    trigger: row.trigger_config,
    action: row.action_config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Create automation
 */
exports.createAutomation = async (organizationId, automation) => {
  const result = await pool.query(
    `
    INSERT INTO automations (
      organization_id,
      name,
      description,
      type,
      enabled,
      trigger_config,
      action_config
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `,
    [
      organizationId,
      automation.name,
      automation.description || null,
      automation.type,
      automation.enabled !== false,
      automation.trigger || {},
      automation.action || {},
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    enabled: row.enabled,
    trigger: row.trigger_config,
    action: row.action_config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Update automation
 */
exports.updateAutomation = async (id, organizationId, updates) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${paramCount++}`);
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(updates.description);
  }
  if (updates.type !== undefined) {
    fields.push(`type = $${paramCount++}`);
    values.push(updates.type);
  }
  if (updates.enabled !== undefined) {
    fields.push(`enabled = $${paramCount++}`);
    values.push(updates.enabled);
  }
  if (updates.trigger !== undefined) {
    fields.push(`trigger_config = $${paramCount++}`);
    values.push(updates.trigger);
  }
  if (updates.action !== undefined) {
    fields.push(`action_config = $${paramCount++}`);
    values.push(updates.action);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(id);
  values.push(organizationId);

  const result = await pool.query(
    `
    UPDATE automations
    SET ${fields.join(', ')}
    WHERE id = $${paramCount++} AND organization_id = $${paramCount++}
    RETURNING *;
    `,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Automation not found');
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    enabled: row.enabled,
    trigger: row.trigger_config,
    action: row.action_config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Delete automation
 */
exports.deleteAutomation = async (id, organizationId) => {
  const result = await pool.query(
    `
    DELETE FROM automations
    WHERE id = $1 AND organization_id = $2
    RETURNING id;
    `,
    [id, organizationId]
  );

  if (result.rows.length === 0) {
    throw new Error('Automation not found');
  }

  return { deleted: true };
};
