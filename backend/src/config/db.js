// =====================================================================
// MySQL connection pool
// We use a connection pool (instead of a single connection) so that
// multiple requests can query the database concurrently.
// =====================================================================
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vue_exam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // return DATE/DATETIME columns as strings, easier to work with in JS/TS
});

// Quick sanity check on boot so setup mistakes fail loudly instead of
// surfacing as a confusing error on the first API request.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    console.error('Check your .env DB_* values and that MySQL is running.');
  }
}

module.exports = { pool, testConnection };
