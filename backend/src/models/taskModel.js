// =====================================================================
// Task model
// This is the most important model in the exam: it demonstrates a
// "relation query" by JOINing tasks with users and categories so the
// API can return human-readable category_name / owner name instead of
// just raw foreign key ids.
// =====================================================================
const { pool } = require('../config/db');

const BASE_SELECT = `
  SELECT
    t.id, t.title, t.description, t.status, t.priority, t.due_date,
    t.user_id, t.category_id, t.created_at, t.updated_at,
    c.name  AS category_name,
    c.color AS category_color,
    u.name  AS owner_name
  FROM tasks t
  LEFT JOIN categories c ON c.id = t.category_id
  LEFT JOIN users u      ON u.id = t.user_id
`;
async function findAllForUser(userId, { status, categoryId, search, page = 1, limit = 10 }) {
  const conditions = ['t.user_id = ?'];
  const params = [userId];

  if (status) {
    conditions.push('t.status = ?');
    params.push(status);
  }
  if (categoryId) {
    conditions.push('t.category_id = ?');
    params.push(categoryId);
  }
  if (search) {
    conditions.push('t.title LIKE ?');
    params.push(`%${search}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;
  const offset = (Number(page) - 1) * Number(limit);

  const [rows] = await pool.query(
    `${BASE_SELECT} ${where} ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM tasks t ${where}`,
    params
  );

  return {
    tasks: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
  };
}

async function findByIdForUser(id, userId) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE t.id = ? AND t.user_id = ?`, [id, userId]);
  return rows[0] || null;
}

async function create({ title, description, status, priority, dueDate, userId, categoryId }) {
  const [result] = await pool.query(
    `INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description || null, status || 'todo', priority || 'medium', dueDate || null, userId, categoryId || null]
  );
  return findByIdForUser(result.insertId, userId);
}

async function update(id, userId, { title, description, status, priority, dueDate, categoryId }) {
  await pool.query(
    `UPDATE tasks
     SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category_id = ?
     WHERE id = ? AND user_id = ?`,
    [title, description || null, status, priority, dueDate || null, categoryId || null, id, userId]
  );
  return findByIdForUser(id, userId);
}

async function updateStatus(id, userId, status) {
  await pool.query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, id, userId]);
  return findByIdForUser(id, userId);
}

async function remove(id, userId) {
  await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
}

module.exports = {
  findAllForUser,
  findByIdForUser,
  create,
  update,
  updateStatus,
  remove,
};
