const pool = require('../../config/db');

exports.createWorkspace = async (organizationId, name) => {
  const result = await pool.query(
    `INSERT INTO workspaces (organization_id, name)
     VALUES ($1, $2)
     RETURNING id, name, created_at`,
    [organizationId, name]
  );

  return result.rows[0];
};

exports.getWorkspaces = async (organizationId) => {
  const result = await pool.query(
    `SELECT id, name, created_at
     FROM workspaces
     WHERE organization_id = $1
     ORDER BY created_at DESC`,
    [organizationId]
  );

  // If no workspaces exist, create a default one
  if (result.rows.length === 0) {
    console.log('No workspaces found, creating default workspace for org:', organizationId);
    
    const createResult = await pool.query(
      `INSERT INTO workspaces (organization_id, name)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
      [organizationId, 'Default Workspace']
    );
    
    console.log('Default workspace created:', createResult.rows[0]);
    return createResult.rows;
  }

  return result.rows;
};
