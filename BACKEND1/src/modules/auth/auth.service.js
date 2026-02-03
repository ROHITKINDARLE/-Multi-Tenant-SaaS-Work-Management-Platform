const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

const signup = async ({ organizationName, name, email, password }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Create organization
    const orgResult = await client.query(
      'INSERT INTO organizations (name) VALUES ($1) RETURNING id',
      [organizationName]
    );
    const organizationId = orgResult.rows[0].id;

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const userResult = await client.query(
      `INSERT INTO users (organization_id, name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [organizationId, name, email, hashedPassword]
    );
    const userId = userResult.rows[0].id;

    // 4. Assign Admin role
    const roleResult = await client.query(
      "SELECT id FROM roles WHERE name = 'Admin'"
    );

    if (roleResult.rows.length === 0) {
      throw new Error('Admin role not found');
    }

    const roleId = roleResult.rows[0].id;

    await client.query(
      `INSERT INTO user_roles (user_id, role_id, organization_id)
       VALUES ($1, $2, $3)`,
      [userId, roleId, organizationId]
    );

    // 5. Create default subscription
    await client.query(
      'INSERT INTO subscriptions (organization_id) VALUES ($1)',
      [organizationId]
    );

    await client.query('COMMIT');

    return { userId, organizationId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT u.id, u.password_hash, u.organization_id, r.name AS role
     FROM users u
     JOIN user_roles ur ON ur.user_id = u.id
     JOIN roles r ON r.id = ur.role_id
     WHERE u.email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      organizationId: user.organization_id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token };
};

/**
 * 🔑 THIS IS THE MOST IMPORTANT PART
 * We must export BOTH functions
 */
module.exports = {
  signup,
  login
};
