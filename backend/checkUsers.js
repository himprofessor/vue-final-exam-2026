require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkUsers() {
  try {
    const [users] = await pool.query('SELECT id, name, email FROM users');
    console.log('All users:');
    users.forEach(u => console.log(`  - [${u.id}] ${u.name} (${u.email})`));
    
    console.log('\nTasks by user:');
    const [tasksByUser] = await pool.query(`
      SELECT u.id, u.name, u.email, COUNT(t.id) as task_count
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      GROUP BY u.id
    `);
    tasksByUser.forEach(u => console.log(`  - [${u.id}] ${u.name}: ${u.task_count} tasks`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
