-- =====================================================================
-- TaskFlow - Sample Data
-- Run this AFTER schema.sql
-- All seeded users share the password: password123
-- =====================================================================

USE taskflow_db;

-- ---------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@taskflow.com', '$2b$10$Bp4.gfTQzPLjwQBDVcBGtet6CmkJh..hRW9e9tgNbbhHO5JQQUJLe', 'admin'),
('Jane Doe',   'jane@taskflow.com',  '$2b$10$Bp4.gfTQzPLjwQBDVcBGtet6CmkJh..hRW9e9tgNbbhHO5JQQUJLe', 'user'),
('John Smith', 'john@taskflow.com',  '$2b$10$Bp4.gfTQzPLjwQBDVcBGtet6CmkJh..hRW9e9tgNbbhHO5JQQUJLe', 'user');

-- ---------------------------------------------------------------------
-- Categories (shared lookup table)
-- ---------------------------------------------------------------------
INSERT INTO categories (name, color) VALUES
('Work',     '#6366f1'),
('Personal', '#10b981'),
('Study',    '#f59e0b'),
('Urgent',   '#ef4444');

-- ---------------------------------------------------------------------
-- Tasks (belongs to a user AND a category)
-- ---------------------------------------------------------------------
INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id) VALUES
('Prepare Vue.js final exam', 'Draft the exam brief and starter code for students.', 'in_progress', 'high', '2026-07-10', 1, 1),
('Review pull requests', 'Review the pending PRs from the frontend team.', 'todo', 'medium', '2026-07-05', 1, 1),
('Buy groceries', 'Milk, eggs, bread, and coffee.', 'todo', 'low', NULL, 2, 2),
('Finish TypeScript course', 'Complete the last 3 modules on generics.', 'in_progress', 'medium', '2026-07-15', 2, 3),
('Submit tax documents', 'Send the signed documents to the accountant.', 'done', 'high', '2026-06-20', 2, 4),
('Plan weekend trip', 'Book accommodation and plan the itinerary.', 'todo', 'low', '2026-07-20', 3, 2),
('Fix login bug', 'Users report the login button is unresponsive on Safari.', 'in_progress', 'high', '2026-07-03', 3, 1),
('Read "Clean Code" chapter 5', 'Continue reading about functions.', 'todo', 'medium', NULL, 3, 3);
