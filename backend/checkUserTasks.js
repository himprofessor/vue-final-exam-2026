require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkUserTasks() {
  try {
    // Check tasks for user 4 (visa)
    const [tasks] = await pool.query(`
      SELECT t.id, t.title, t.status, t.priority, c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = 4
      ORDER BY t.id DESC
    `);
    
    console.log(`Tasks for user 4 (visa@taskflow.com):`);
    if (tasks.length === 0) {
      console.log('  No tasks found!');
    } else {
      tasks.forEach(t => {
        console.log(`  - [${t.id}] ${t.title}`);
        console.log(`    Status: ${t.status}, Priority: ${t.priority}, Category: ${t.category_name || 'none'}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUserTasks();
