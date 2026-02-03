const pool = require('../../config/db');

/* ===============================
   GET ALL USERS IN ORGANIZATION
================================ */
const getUsersByOrganization = async (organizationId) => {
  try {
    console.log('getUsersByOrganization called with org:', organizationId);
    
    const result = await pool.query(
      `SELECT 
          u.id,
          u.email,
          u.role,
          u.created_at
       FROM users u
       WHERE u.organization_id = $1
       ORDER BY u.created_at DESC`,
      [organizationId]
    );

    console.log('Query returned:', result.rows.length, 'rows');
    console.log('Query results:', result.rows);

    return result.rows || [];
  } catch (err) {
    console.error('Error fetching users:', err.message);
    return [];
  }
};

/* ===============================
   GET USER BY ID
================================ */
const getUserById = async (userId, organizationId) => {
  try {
    const result = await pool.query(
      `SELECT 
          u.id,
          u.email,
          u.role,
          u.created_at
       FROM users u
       WHERE u.id = $1 AND u.organization_id = $2`,
      [userId, organizationId]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error('Error fetching user:', err.message);
    return null;
  }
};

/* ===============================
   UPDATE USER ROLE
================================ */
const updateUserRole = async (userId, role, organizationId) => {
  try {
    const result = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2 AND organization_id = $3
       RETURNING id, email, role`,
      [role, userId, organizationId]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error('Error updating user role:', err.message);
    throw err;
  }
};

/* ===============================
   DELETE USER
================================ */
const deleteUser = async (userId, organizationId) => {
  try {
    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1 AND organization_id = $2
       RETURNING id`,
      [userId, organizationId]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error('Error deleting user:', err.message);
    throw err;
  }
};

module.exports = {
  getUsersByOrganization,
  getUserById,
  updateUserRole,
  deleteUser
};
