const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const schemaSql = `
CREATE DATABASE IF NOT EXISTS taskflow_db;
USE taskflow_db;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATE,
  user_id INT,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
`;

const seedSql = [
  "INSERT IGNORE INTO users (id, name, email, password, role) VALUES (1, 'Admin User', 'admin@taskflow.com', '$2b$10$Bp4.gfTQzPLjwQBDVcBGtet6CmkJh..hRW9e9tgNbbhHO5JQQUJLe', 'admin'), (2, 'Jane Doe', 'jane@taskflow.com', '$2b$10$Bp4.gfTQzPLjwQBDVcBGtet6CmkJh..hRW9e9tgNbbhHO5JQQUJLe', 'user'), (3, 'John Smith', 'john@taskflow.com', '$2b$10$Bp4.gfTQzPLjwQBDVcBGtet6CmkJh..hRW9e9tgNbbhHO5JQQUJLe', 'user');",
  "INSERT IGNORE INTO categories (id, name, color) VALUES (1, 'Work', '#6366f1'), (2, 'Personal', '#10b981'), (3, 'Study', '#f59e0b'), (4, 'Urgent', '#ef4444');",
  "INSERT IGNORE INTO tasks (title, description, status, priority, due_date, user_id, category_id) VALUES ('Prepare Vue.js final exam', 'Draft the exam brief and starter code for students.', 'in_progress', 'high', '2026-07-10', 1, 1), ('Review pull requests', 'Review the pending PRs from the frontend team.', 'todo', 'medium', '2026-07-05', 1, 1), ('Buy groceries', 'Milk, eggs, bread, and coffee.', 'todo', 'low', NULL, 2, 2), ('Finish TypeScript course', 'Complete the last 3 modules on generics.', 'in_progress', 'medium', '2026-07-15', 2, 3), ('Submit tax documents', 'Send the signed documents to the accountant.', 'done', 'high', '2026-06-20', 2, 4), ('Plan weekend trip', 'Book accommodation and plan the itinerary.', 'todo', 'low', '2026-07-20', 3, 2), ('Fix login bug', 'Users report the login button is unresponsive on Safari.', 'in_progress', 'high', '2026-07-03', 3, 1), ('Read \"Clean Code\" chapter 5', 'Continue reading about functions.', 'todo', 'medium', NULL, 3, 3);"
];

const passwords = ["12345678", "", "root", "admin", "password"];

async function main() {
  let connection;
  let correctPassword = null;
  
  for (let p of passwords) {
    try {
      connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: p,
        port: 3306,
        multipleStatements: true
      });
      correctPassword = p;
      break;
    } catch(e) {}
  }
  
  if (correctPassword === null) {
    console.log("❌ Could not crack password automatically. Please check your MySQL server setup.");
    return;
  }
  
  console.log(`✔ Found your real password: "${correctPassword}"`);
  await connection.query(schemaSql);
  for (let s of seedSql) { await connection.query(s); }
  console.log("✔ Created database and seeded users successfully.");
  
  const envPath = path.join(__dirname, '.env');
  let content = fs.readFileSync(envPath, 'utf8');
  content = content.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${correctPassword}`);
  content = content.replace(/DB_HOST=.*/, `DB_HOST=127.0.0.1`);
  fs.writeFileSync(envPath, content, 'utf8');
  console.log("✔ Overwrote your .env file with correct setup values!");
  console.log("\n🚀 FIX COMPLETE! Go to your backend terminal, close it, run 'npm run dev' again, and log in!");
  await connection.end();
}
main();
