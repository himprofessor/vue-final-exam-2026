# TaskFlow — Exam Submission

## Completed TODOs

### 1. `frontend/src/services/taskService.ts`
Implemented the three missing service methods following the `categoryService.ts` pattern:

- **`create(payload)`** — `POST /tasks` with the task payload, returns `ApiResponse<{ task: Task }>`
- **`update(id, payload)`** — `PUT /tasks/{id}` with the task payload, returns `ApiResponse<{ task: Task }>`
- **`remove(id)`** — `DELETE /tasks/{id}`, returns `ApiResponse<null>`

All methods use the centralized `api` axios instance with proper TypeScript generics.

### 2. `frontend/src/stores/tasks.ts`
Implemented all five store actions following the `categories` store pattern:

- **`createTask(payload)`** — Sets loading, calls `taskService.create()`, re-fetches the task list on success, returns `true`/`false`
- **`updateTask(id, payload)`** — Same pattern, calls `taskService.update(id, payload)`
- **`deleteTask(id)`** — Same pattern, calls `taskService.remove(id)`
- **`setFilters(newFilters)`** — Merges filters, resets page to 1, calls `fetchTasks()`
- **`resetFilters()`** — Restores default filter values, calls `fetchTasks()`

All actions properly set `loading`/`error` state, use try/catch/finally, and re-fetch data after mutations.

### 3. Verification
Full task CRUD was verified end-to-end via browser automation:
- ✅ Create a task with title, description, priority, and category
- ✅ Verify the task appears in the list
- ✅ Edit the task title
- ✅ Verify the update is reflected
- ✅ Toggle task status (In Progress)
- ✅ Delete the task via confirmation dialog
- ✅ Verify the task is removed

Backend API endpoints were also tested via curl and confirmed working.

---

## Bonus Tasks Completed

### ✅ Debounced Search Input (`TasksView.vue`)

Added a search input field in the Tasks page filters area with 300ms debounce. The backend already supported the `?search=` query parameter (searches by task title via `LIKE %keyword%`). Implementation:

- Added `BaseInput` in the filter row (3 columns: search, status, category)
- Used a local `searchQuery` ref with `watch` + `setTimeout` for 300ms debounce
- Clean up the timeout in `onUnmounted` to prevent memory leaks
- Integrates with the existing `setFilters` action which resets page to 1

---

## TypeScript Check

`npx vue-tsc --noEmit` passes with zero errors.

## Best Practices Checklist

- [x] `npm run type-check` (frontend) passes with no errors
- [x] No `console.log` debugging statements left in committed code
- [x] Every store action that calls the API sets `loading` and handles `error`
- [x] Every list view has a loading state, an error state, and an empty state
- [x] Forms validate required fields before submitting
- [x] No API URLs or secrets are hardcoded — everything comes from `.env`
- [x] The app works after a hard refresh while logged in (token persistence)
