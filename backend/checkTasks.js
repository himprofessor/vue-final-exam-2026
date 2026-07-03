require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkTasks() {
  try {
    const [tasks] = await pool.query('SELECT id, title, status, category_id, user_id FROM tasks ORDER BY id DESC LIMIT 5');
    console.log(`Found ${tasks.length} recent tasks:`);
    tasks.forEach(t => console.log(`  - [${t.id}] ${t.title} (status: ${t.status}, category: ${t.category_id}, user: ${t.user_id})`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTasks();
