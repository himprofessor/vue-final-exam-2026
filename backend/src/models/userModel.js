// =====================================================================
// User model
// Thin data-access layer around the `users` table. Controllers should
// never write raw SQL directly - they call these functions instead.
// This keeps the SQL in one place and makes the controllers easy to read.
// =====================================================================
const { pool } = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT id, name, email, password, role, created_at FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create({ name, email, hashedPassword }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return findById(result.insertId);
}

module.exports = { findByEmail, findById, create };
