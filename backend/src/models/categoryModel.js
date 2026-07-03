const { pool } = require('../config/db');

async function findAll() {
  // (Bonus idea for students: add a COUNT(tasks.id) to show how many
  // tasks use each category - a classic "relation query".)
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ name, color }) {
  const [result] = await pool.query(
    'INSERT INTO categories (name, color) VALUES (?, ?)',
    [name, color]
  );
  return findById(result.insertId);
}

async function update(id, { name, color }) {
  await pool.query('UPDATE categories SET name = ?, color = ? WHERE id = ?', [name, color, id]);
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
