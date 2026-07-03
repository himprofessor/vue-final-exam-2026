-- =====================================================================
-- TaskFlow - Task Management System
-- Database Schema
-- =====================================================================
-- Relationship overview:
--   users (1) ----< tasks (many)      -- each task belongs to ONE user
--   categories (1) ----< tasks (many) -- each task belongs to ONE category
--
-- This gives you TWO one-to-many relationships to practice with:
--   1. users -> tasks   (ownership / auth-scoped data)
--   2. categories -> tasks (classification / lookup data)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS taskflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskflow_db;

-- ---------------------------------------------------------------------
-- Table: users
-- Stores registered accounts. Passwords are hashed with bcrypt, never
-- store plain-text passwords.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL, -- bcrypt hash
  role          ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: categories
-- Lookup table shared by all users (e.g. "Work", "Personal", "Study").
-- One category can be used by MANY tasks -> one-to-many relationship.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(80)   NOT NULL UNIQUE,
  color         VARCHAR(20)   NOT NULL DEFAULT '#6366f1', -- hex color for UI badges
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: tasks
-- The main entity of the exam. Each task:
--   - belongs to exactly one USER  (user_id  -> users.id)
--   - belongs to exactly one CATEGORY (category_id -> categories.id)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150)  NOT NULL,
  description   TEXT          NULL,
  status        ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  priority      ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  due_date      DATE          NULL,
  user_id       INT           NOT NULL,
  category_id   INT           NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tasks_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Helpful indexes for the "relation queries" / filtering requirement
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_status ON tasks(status);
