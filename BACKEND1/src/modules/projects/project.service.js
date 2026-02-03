const pool = require('../../config/db');

const createProject = async ({
  organizationId,
  ownerId,
  workspaceId,
  name,
  description,
  deadline
}) => {
  // 🔐 Tenant safety check: workspace must belong to org
  const workspaceCheck = await pool.query(
    `SELECT id FROM workspaces
     WHERE id = $1 AND organization_id = $2`,
    [workspaceId, organizationId]
  );

  if (workspaceCheck.rows.length === 0) {
    throw new Error('Invalid workspace access');
  }

  const result = await pool.query(
    `INSERT INTO projects
     (workspace_id, organization_id, owner_id, name, description, deadline)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, description, deadline, created_at`,
    [workspaceId, organizationId, ownerId, name, description, deadline]
  );

  return result.rows[0];
};

const getProjectsByWorkspace = async (organizationId, workspaceId) => {
  const result = await pool.query(
    `SELECT id, name, description, deadline, created_at
     FROM projects
     WHERE organization_id = $1 AND workspace_id = $2
     ORDER BY created_at DESC`,
    [organizationId, workspaceId]
  );

  return result.rows;
};

const updateProject = async (projectId, organizationId, updates) => {
  const { name, description, deadline, status, priority, progress } = updates;
  
  // Verify project belongs to organization
  const check = await pool.query(
    `SELECT id FROM projects WHERE id = $1 AND organization_id = $2`,
    [projectId, organizationId]
  );

  if (check.rows.length === 0) {
    throw new Error('Project not found or access denied');
  }

  // Build dynamic update query
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (name !== undefined) {
    fields.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (deadline !== undefined) {
    fields.push(`deadline = $${paramCount++}`);
    values.push(deadline);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(projectId);
  
  const result = await pool.query(
    `UPDATE projects
     SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, name, description, deadline, created_at`,
    values
  );

  return result.rows[0];
};

/**
 * 🔑 EXPORT FUNCTIONS (THIS FIXES YOUR ERROR)
 */
module.exports = {
  createProject,
  getProjectsByWorkspace,
  updateProject
};
