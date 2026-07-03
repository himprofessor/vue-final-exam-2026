# TaskFlow — Vue.js Final Exam Project

A small but realistic **Task Management System** built with Vue 3 + TypeScript + Pinia on the frontend and Node.js + Express + MySQL on the backend. This repository is the **starter code and exam brief** for the Vue.js course final exam.

> Read this entire document before you start coding. It is your exam instructions, setup guide, and reference all in one.

---

## 1. Project Overview

TaskFlow lets authenticated users create, organize, and track personal tasks. Each task belongs to a **category** (e.g. Work, Personal, Study) and to the **user** who created it — this gives you two real one-to-many relationships to work with:

- `users` → `tasks` (a user owns many tasks)
- `categories` → `tasks` (a category classifies many tasks)

The backend API is fully implemented and documented below. Most of the **frontend is implemented for you as a reference** (authentication, layout, the Categories page) — the **Tasks feature has deliberate gaps (marked `TODO`)** that you must complete to pass the exam. This mirrors real work: you're given a working pattern and asked to extend it consistently.

## 2. Features

- JWT authentication (register / login / logout, protected routes)
- Full CRUD for **Categories** (already implemented — your reference)
- Full CRUD for **Tasks**, scoped to the logged-in user (partially implemented — **your task**)
- Relational data: tasks display their category name/color and owner
- Filtering by status and category, plus pagination
- Loading, error, and empty states on every data view
- Reusable UI components (button, input, select, modal, confirm dialog, badge, spinner, empty state, error alert)
- Responsive layout with a sidebar + header shell

## 3. Technologies Used

**Frontend:** Vue 3 (Composition API), TypeScript, Pinia, Vue Router 4, Axios, TailwindCSS, Vite

**Backend:** Node.js, Express.js, MySQL (mysql2), JWT (jsonwebtoken), bcryptjs, express-validator, CORS, Morgan

---

## 4. Folder Structure

```
vue-final-exam/
├── README.md                  ← you are here
├── database/
│   ├── schema.sql              ← CREATE TABLE statements + relationships
│   └── seed.sql                ← sample data (3 users, 4 categories, 8 tasks)
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js              ← Express app setup (middleware + routes)
│       ├── server.js           ← entry point, starts the HTTP server
│       ├── config/db.js        ← MySQL connection pool
│       ├── middleware/         ← auth guard, validation, error handling
│       ├── controllers/        ← request handlers (auth, categories, tasks)
│       ├── models/              ← SQL queries, one file per table
│       ├── routes/              ← Express routers, one file per resource
│       └── utils/               ← JWT helpers, custom AppError class
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── main.ts              ← app bootstrap (Pinia + Router)
        ├── App.vue
        ├── router/index.ts       ← routes + auth guard
        ├── types/index.ts        ← shared TypeScript interfaces
        ├── services/              ← axios instance + one file per resource
        ├── stores/                ← Pinia stores (auth, categories, tasks)
        ├── components/
        │   ├── ui/                ← generic reusable components
        │   ├── layout/            ← AppLayout, AppSidebar, AppHeader
        │   ├── categories/        ← CategoryForm.vue
        │   └── tasks/             ← TaskForm.vue, TaskRow.vue
        └── views/                 ← one component per route/page
```

### Why this structure?

- **Backend** follows a modular MVC-like layout: `routes` define *what* endpoints exist, `controllers` define *how* a request is handled, `models` define *how data is fetched/stored*. This separation is what the exam means by "clean code structure."
- **Frontend** separates **services** (raw API calls), **stores** (state + business logic + loading/error handling), and **views/components** (presentation). Components should never call `axios` directly — they call a store action, which calls a service.

---

## 5. Database Setup

1. Make sure MySQL is installed and running locally (or use a Docker container).
2. Run the schema file to create the database and tables:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. Load the sample data:

   ```bash
   mysql -u root -p < database/seed.sql
   ```

4. Seeded accounts (password for all of them is `password123`):

   | Email                  | Role  |
   |-------------------------|-------|
   | admin@taskflow.com      | admin |
   | jane@taskflow.com       | user  |
   | john@taskflow.com       | user  |

### Relationship explanation

```
users (1) ──────< tasks (many)        ON DELETE CASCADE
categories (1) ──< tasks (many)       ON DELETE SET NULL
```

- `tasks.user_id` is a foreign key to `users.id`. Deleting a user deletes their tasks (`CASCADE`).
- `tasks.category_id` is a foreign key to `categories.id` and is nullable. Deleting a category does **not** delete its tasks — it just sets `category_id` to `NULL` (`SET NULL`), so a task can exist without a category.
- Every `GET /api/tasks` request performs a `LEFT JOIN` against both `users` and `categories` so the API can return `owner_name`, `category_name`, and `category_color` alongside the raw foreign keys. Look at `backend/src/models/taskModel.js` for the query.

---

## 6. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MySQL credentials
npm run dev
```

The API starts on `http://localhost:5000` by default. Visit `http://localhost:5000/api/health` to confirm it's running.

### Environment variables (`backend/.env`)

| Variable          | Description                                      | Example                  |
|--------------------|--------------------------------------------------|--------------------------|
| `PORT`             | Port the Express server listens on                | `5000`                   |
| `NODE_ENV`         | `development` or `production`                     | `development`            |
| `DB_HOST`          | MySQL host                                        | `localhost`              |
| `DB_PORT`          | MySQL port                                        | `3306`                   |
| `DB_USER`          | MySQL user                                        | `root`                   |
| `DB_PASSWORD`      | MySQL password                                    | `your_mysql_password`    |
| `DB_NAME`          | Database name                                     | `taskflow_db`            |
| `JWT_SECRET`       | Secret used to sign JWTs — use a long random value| `super_secret_key_123`   |
| `JWT_EXPIRES_IN`   | Token lifetime                                    | `7d`                     |
| `CLIENT_URL`       | Frontend URL, used for CORS                       | `http://localhost:5173`  |

---

## 7. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm run dev
```

The app starts on `http://localhost:5173` by default.

### Environment variables (`frontend/.env`)

| Variable              | Description                          | Example                        |
|------------------------|---------------------------------------|---------------------------------|
| `VITE_API_BASE_URL`   | Base URL of the backend API           | `http://localhost:5000/api`     |

---

## 8. API Endpoint Documentation

All endpoints are prefixed with `/api`. Endpoints marked 🔒 require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint             | Description                     | Body                              |
|--------|------------------------|----------------------------------|-------------------------------------|
| POST   | `/auth/register`       | Create a new account             | `{ name, email, password }`        |
| POST   | `/auth/login`          | Log in, returns a JWT             | `{ email, password }`              |
| GET    | `/auth/me` 🔒          | Get the current logged-in user    | —                                   |

### Categories 🔒 (all routes require auth)

| Method | Endpoint             | Description             | Body                        |
|--------|------------------------|---------------------------|-------------------------------|
| GET    | `/categories`          | List all categories        | —                             |
| POST   | `/categories`          | Create a category          | `{ name, color? }`            |
| PUT    | `/categories/:id`      | Update a category           | `{ name, color? }`            |
| DELETE | `/categories/:id`      | Delete a category           | —                             |

### Tasks 🔒 (all routes require auth, always scoped to the logged-in user)

| Method | Endpoint                  | Description                                 | Body / Query |
|--------|-----------------------------|-----------------------------------------------|----------------|
| GET    | `/tasks`                    | List the current user's tasks                  | query: `status`, `category_id`, `search`, `page`, `limit` |
| GET    | `/tasks/:id`                | Get a single task                              | — |
| POST   | `/tasks`                    | Create a task                                   | `{ title, description?, status?, priority?, due_date?, category_id? }` |
| PUT    | `/tasks/:id`                | Update a task                                   | same shape as create |
| PATCH  | `/tasks/:id/status`         | Quick status update                             | `{ status }` |
| DELETE | `/tasks/:id`                | Delete a task                                   | — |

All responses follow this shape:

```json
{
  "success": true,
  "message": "optional human readable message",
  "data": { }
}
```

Errors follow the same envelope with `"success": false` and an appropriate HTTP status code (400/401/404/409/422/500).

---

## 9. Exam Objectives

This exam evaluates your ability to:

1. Integrate an API with a Pinia store (not call axios directly from components)
2. Implement full CRUD operations against a real REST API
3. Work with one-to-many relational data (tasks ↔ categories, tasks ↔ users)
4. Handle errors gracefully and show them to the    user
5. Build a proper empty-state UI
6. Build a proper loading-state UI
7. Write clean, readable code
8. Organize components sensibly (presentational vs. container, reusable UI kit)
9. Understand how a Vue frontend and an Express/MySQL backend fit together

---

## 10. Your Tasks (What You Need to Complete)

The **Categories** feature (`stores/categories.ts`, `services/categoryService.ts`, `views/CategoriesView.vue`) is fully implemented. Study it first — it is the pattern you'll repeat.

The **Tasks** feature has the following `TODO`s:

1. **`frontend/src/services/taskService.ts`** — implement `create`, `update`, and `remove` (they currently throw an error).
2. **`frontend/src/stores/tasks.ts`**:
   - `createTask(payload)` — call the service, then re-fetch the list
   - `updateTask(id, payload)` — same pattern
   - `deleteTask(id)` — same pattern
   - `setFilters(newFilters)` / `resetFilters()` — update `filters.value` and re-fetch
3. Once those are done, `TasksView.vue` should work with **no changes needed** — it already calls these store actions.

Search the codebase for the string `TODO` to find every spot that needs your attention.

---

## 11. Suggested Development Steps

1. Set up the database (schema + seed) and confirm you can connect with a MySQL client.
2. Start the backend, hit `/api/health`, then test `/api/auth/login` with a seeded user (e.g. with Postman/Insomnia/curl).
3. Start the frontend, log in with the demo account, and confirm the Dashboard and Categories pages load real data.
4. Read `stores/categories.ts` end to end. Make sure you understand every line before touching `stores/tasks.ts`.
5. Implement `taskService.ts` TODOs first (they're small).
6. Implement `stores/tasks.ts` TODOs one at a time, testing in the browser after each one (create → update → delete → filters).
7. Confirm loading spinners appear while requests are in flight, errors show a dismissible alert, and an empty list shows the empty state.
8. Polish: check the app on a narrow (mobile-width) browser window.

## 12. Suggested Exam Duration

**3 – 4 hours**, broken down roughly as:

- 30 min: environment setup (DB, backend, frontend running)
- 30 min: reading and understanding the existing code (Categories pattern)
- 90–120 min: implementing the Tasks TODOs (service + store + testing)
- 30–45 min: polish, responsive check, manual testing, README of your own changes if requested by your instructor

---

## 13. Common Mistakes to Avoid

- **Calling axios directly from a component.** Always go through a store action — that's the whole point of the Pinia integration objective.
- **Forgetting to re-fetch after a create/update/delete.** The UI should always reflect the latest server state, not a locally-guessed state.
- **Not resetting `page` to 1 when filters change.** Otherwise users can get stuck on an empty page 3 after filtering.
- **Swallowing errors silently.** Every `catch` block should set `error.value` to something the user can actually read — don't just `console.log` it.
- **Mutating `tasks.value` by hand** instead of re-fetching or replacing it wholesale — this tends to get state out of sync with the server.
- **Forgetting `due_date` can be `null`.** Not every task has a due date — handle that in both the form and the table.
- **Hardcoding `http://localhost:5000`** instead of using `import.meta.env.VITE_API_BASE_URL`.
- **Skipping the empty state.** A blank white screen when there's no data is not acceptable for this exam.

---

## 14. Bonus Tasks (Optional, for extra credit)

- Add a "Mark all as done" bulk action for the currently filtered tasks.
- Add a search input (the backend already supports `?search=`) with debounced input.
- Add category task-counts to the Categories page using a relation query (`COUNT(tasks.id)` grouped by category).
- Add an admin-only view that lists tasks across *all* users (requires checking `req.user.role` server-side).
- Add sorting (by due date or priority) to the Tasks table.
- Persist the current filters in the URL query string so a refresh doesn't reset them.
- Add unit tests for one Pinia store action using Vitest.

---

## 15. Evaluation Rubric

| Category                                             | Points |
|--------------------------------------------------------|--------|
| Pinia store integration (actions call services correctly) | 20 |
| CRUD correctness (create/update/delete all work end-to-end) | 20 |
| Relational data handled correctly (category/user display, FK usage) | 10 |
| Error handling (API errors surface as readable UI messages) | 10 |
| Loading state UI (spinners / disabled buttons while pending) | 10 |
| Empty state UI (clear message + call to action when no data) | 10 |
| Code quality (clean, typed, no `any` abuse, consistent naming) | 10 |
| Component organization (reuses existing UI kit, no duplication) | 5 |
| Responsive layout (usable on mobile width) | 5 |
| **Total** | **100** |

### Scoring guide

- **90–100:** All TODOs complete, matches the Categories pattern, clean TypeScript, handles edge cases (null due_date, empty description).
- **75–89:** All TODOs complete and functional, minor style/consistency issues.
- **50–74:** Most TODOs complete; some CRUD operations partially work or errors aren't handled.
- **Below 50:** Major TODOs missing or the app does not run.

---

## 16. Best Practices Checklist

Before submitting, confirm:

- [ ] `npm run type-check` (frontend) passes with no errors
- [ ] No `console.log` debugging statements left in committed code
- [ ] Every store action that calls the API sets `loading` and handles `error`
- [ ] Every list view has a loading state, an error state, and an empty state
- [ ] Forms validate required fields before submitting
- [ ] No API URLs or secrets are hardcoded — everything comes from `.env`
- [ ] The app works after a hard refresh while logged in (token persistence)
- [ ] The UI does not break at a mobile viewport width (375px)

---

## 17. Submission Instructions

1. Make sure both `backend/` and `frontend/` run cleanly from a fresh `npm install`.
2. Do **not** commit `node_modules/` or your real `.env` files — only `.env.example`.
3. Zip the project (or push to a Git repository, per your instructor's preference) and include:
   - Your completed source code
   - A short note (in this README or a separate `SUBMISSION.md`) describing any bonus tasks you attempted
4. Submit before the exam deadline set by your instructor.

---

Good luck — and remember: when in doubt, look at how `categories` does it, and do the same for `tasks`.
