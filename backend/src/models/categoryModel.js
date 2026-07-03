const { pool } = require('../config/db');

async function findAll() {
  
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

Category.findAllWithCounts = function(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        c.*,
        COUNT(t.id) as task_count
      FROM categories c
      LEFT JOIN tasks t ON t.category_id = c.id AND t.user_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `
    db.query(query, [userId], (error, results) => {
      if (error) return reject(error)
      resolve(results)
    })
  })
}
