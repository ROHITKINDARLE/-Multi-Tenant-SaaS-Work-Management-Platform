const pool = require('../../config/db');

/* ===============================
   ADD TRANSITION
================================ */
const addTransition = async ({
  organizationId,
  workflowId,
  fromState,
  toState,
}) => {
  // Verify workflow ownership
  const wf = await pool.query(
    `SELECT id FROM workflows
     WHERE id = $1 AND organization_id = $2`,
    [workflowId, organizationId]
  );

  if (wf.rows.length === 0) {
    throw new Error('Invalid workflow');
  }

  // Verify states exist in workflow
  const fromStateExists = await pool.query(
    `SELECT id FROM workflow_states
     WHERE workflow_id = $1 AND name = $2`,
    [workflowId, fromState]
  );

  const toStateExists = await pool.query(
    `SELECT id FROM workflow_states
     WHERE workflow_id = $1 AND name = $2`,
    [workflowId, toState]
  );

  if (fromStateExists.rows.length === 0 || toStateExists.rows.length === 0) {
    throw new Error('Invalid states for workflow');
  }

  const result = await pool.query(
    `INSERT INTO workflow_transitions
     (workflow_id, from_state, to_state)
     VALUES ($1, $2, $3)
     RETURNING id, workflow_id, from_state, to_state`,
    [workflowId, fromState, toState]
  );

  return result.rows[0];
};

/* ===============================
   GET TRANSITIONS
================================ */
const getTransitions = async (organizationId) => {
  try {
    console.log('getTransitions called with organizationId:', organizationId);

    // Get the workflow for this organization
    const wfRes = await pool.query(
      `SELECT id FROM workflows WHERE organization_id = $1 LIMIT 1`,
      [organizationId]
    );
    console.log('Workflows for org:', wfRes.rows);

    if (wfRes.rows.length === 0) {
      console.log('No workflow found for org');
      return [];
    }

    const workflowId = wfRes.rows[0].id;

    // Check if transitions exist for this workflow
    const existingRes = await pool.query(
      `SELECT COUNT(*) as count FROM workflow_transitions WHERE workflow_id = $1`,
      [workflowId]
    );

    const transitionCount = parseInt(existingRes.rows[0]?.count || 0);
    console.log('Transitions for this workflow:', transitionCount);

    // If no transitions, create default ones
    if (transitionCount === 0) {
      console.log('Creating default transitions for workflow:', workflowId);
      
      // Get states for this workflow
      const statesRes = await pool.query(
        `SELECT id, name FROM workflow_states WHERE workflow_id = $1 ORDER BY name`,
        [workflowId]
      );

      const states = statesRes.rows || [];
      console.log('States:', states);

      const stateMap = {};
      states.forEach((s) => {
        stateMap[s.name.toLowerCase()] = s.id;
      });

      // Default transitions
      const defaults = [
        ['todo', 'in progress'],
        ['in progress', 'in review'],
        ['in review', 'done'],
        ['in progress', 'todo'],
        ['in review', 'in progress'],
        ['done', 'in review'],
      ];

      for (const [fromName, toName] of defaults) {
        const fromId = stateMap[fromName];
        const toId = stateMap[toName];
        if (fromId && toId) {
          await pool.query(
            `INSERT INTO workflow_transitions (workflow_id, from_state, to_state)
             VALUES ($1, $2, $3)
             ON CONFLICT DO NOTHING`,
            [workflowId, fromId, toId]
          );
          console.log(`Created transition: ${fromName} → ${toName}`);
        }
      }
    }

    // Now fetch transitions for this workflow
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

    console.log('getTransitions result:', result.rows);
    return result.rows || [];
  } catch (err) {
    console.error('getTransitions query error:', err.message);
    console.error('getTransitions full error:', err);
    return [];
  }
};

module.exports = {
  addTransition,
  getTransitions,
};
