const pool = require('../../config/db');

/* ===============================
   CREATE WORKFLOW
================================ */
const createWorkflow = async (organizationId, name) => {
  const result = await pool.query(
    `INSERT INTO workflows (organization_id, name)
     VALUES ($1, $2)
     RETURNING id, name, created_at`,
    [organizationId, name]
  );

  return result.rows[0];
};

/* ===============================
   ADD STATE
================================ */
const addState = async ({
  organizationId,
  workflowId,
  name,
  position,
}) => {
  // Ensure workflow belongs to org
  const wfCheck = await pool.query(
    `SELECT id FROM workflows
     WHERE id = $1 AND organization_id = $2`,
    [workflowId, organizationId]
  );

  if (wfCheck.rows.length === 0) {
    throw new Error('Invalid workflow');
  }

  const result = await pool.query(
    `INSERT INTO workflow_states (workflow_id, name, position)
     VALUES ($1, $2, $3)
     RETURNING id, name, position`,
    [workflowId, name, position]
  );

  return result.rows[0];
};

/* ===============================
   GET WORKFLOW BY ID
================================ */
const getWorkflow = async (organizationId, workflowId) => {
  const wf = await pool.query(
    `SELECT id, name
     FROM workflows
     WHERE id = $1 AND organization_id = $2`,
    [workflowId, organizationId]
  );

  if (wf.rows.length === 0) {
    throw new Error('Workflow not found');
  }

  const states = await pool.query(
    `SELECT id, name, position
     FROM workflow_states
     WHERE workflow_id = $1
     ORDER BY position`,
    [workflowId]
  );

  return {
    ...wf.rows[0],
    states: states.rows,
  };
};

/* ===============================
   GET ALL WORKFLOWS (NEW)
================================ */
const getAllWorkflows = async (organizationId) => {
  const result = await pool.query(
    `SELECT id, name, created_at
     FROM workflows
     WHERE organization_id = $1
     ORDER BY created_at DESC`,
    [organizationId]
  );

  return result.rows;
};

/* ===============================
   GET WORKFLOW TRANSITIONS (NEW)
================================ */
const getTransitions = async (organizationId) => {
  try {
    const result = await pool.query(
      `SELECT 
          t.workflow_id,
          t.from_state,
          t.to_state,
          w.name AS workflow_name
       FROM workflow_transitions t
       JOIN workflows w ON w.id = t.workflow_id
       WHERE w.organization_id = $1
       ORDER BY t.workflow_id, t.from_state, t.to_state`,
      [organizationId]
    );

    return result.rows || [];
  } catch (err) {
    console.error('getTransitions query error:', err.message);
    // If table doesn't exist or schema is wrong, return empty array
    return [];
  }
};

/* ===============================
   GET ALL WORKFLOW STATES (NEW)
================================ */
const getAllStates = async (organizationId) => {
  try {
    // First, check if any workflow states exist
    const result = await pool.query(
      `SELECT 
          ws.id,
          ws.name,
          ws.position,
          w.id AS workflow_id,
          w.name AS workflow_name
       FROM workflow_states ws
       JOIN workflows w ON w.id = ws.workflow_id
       WHERE w.organization_id = $1
       ORDER BY w.id, ws.position`,
      [organizationId]
    );
    
    // If no states exist, create default ones
    if (result.rows.length === 0) {
      // Check if workflows exist
      const workflowCheck = await pool.query(
        `SELECT id FROM workflows WHERE organization_id = $1 LIMIT 1`,
        [organizationId]
      );
      
      let workflowId;
      
      if (workflowCheck.rows.length === 0) {
        // Create a default workflow
        const createWorkflowResult = await pool.query(
          `INSERT INTO workflows (organization_id, name)
           VALUES ($1, $2)
           RETURNING id`,
          [organizationId, 'Default Workflow']
        );
        
        workflowId = createWorkflowResult.rows[0].id;
      } else {
        workflowId = workflowCheck.rows[0].id;
      }
      
      // Now create default states
      const defaultStates = ['Todo', 'In Progress', 'In Review', 'Done'];
      await pool.query(
        `INSERT INTO workflow_states (workflow_id, name, position)
         VALUES 
           ($1, $2, 1),
           ($1, $3, 2),
           ($1, $4, 3),
           ($1, $5, 4)
         RETURNING id, name, position`,
        [workflowId, ...defaultStates]
      );
      
      // Now fetch the states again with workflow info
      const finalResult = await pool.query(
        `SELECT 
            ws.id,
            ws.name,
            ws.position,
            w.id AS workflow_id,
            w.name AS workflow_name
         FROM workflow_states ws
         JOIN workflows w ON w.id = ws.workflow_id
         WHERE w.organization_id = $1
         ORDER BY w.id, ws.position`,
        [organizationId]
      );
      
      return finalResult.rows || [];
    }
    
    return result.rows || [];
  } catch (err) {
    console.error('Error fetching workflow states:', err.message);
    return [];
  }
};

module.exports = {
  createWorkflow,
  addState,
  getWorkflow,
  getAllWorkflows,     // ✅ added
  getTransitions,      // ✅ added
  getAllStates,        // ✅ added
};
