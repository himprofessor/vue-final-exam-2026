// =====================================================================
// Tasks store - THIS IS YOUR MAIN EXAM TASK.
//
// The `categories` store (stores/categories.ts) is a complete working
// example. This file follows the exact same pattern, but several
// actions are left as TODOs for you to finish.
//
// Read stores/categories.ts FIRST if you're not sure where to start.
// =====================================================================
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskFilters, Pagination, TaskStatus } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  // ---- state -----------------------------------------------------------
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const filters = ref<TaskFilters>({ status: '', category_id: '', search: '', page: 1, limit: 10 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- actions -----------------------------------------------------------

  // Fully implemented - use this as your reference for the TODOs below.
  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getAll(filters.value)
      tasks.value = data.data.tasks
      pagination.value = data.data.pagination
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tasks.'
    } finally {
      loading.value = false
    }
  }

  // -----------------------------------------------------------------------
  // TODO 1: implement createTask(payload)
  //
  // Requirements:
  //   - set loading = true and clear error before the request
  //   - after a successful create, call fetchTasks() again so the list
  //     reflects the new task (this is the "re-fetch after CRUD" pattern
  //     mentioned in the exam brief)
  //   - wrap everything in try/catch/finally like fetchTasks() above
  //   - return true on success, false on failure (so the component
  //     calling this action knows whether to close the modal)
  // -----------------------------------------------------------------------
  async function createTask(_payload: TaskPayload): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await taskService.create(_payload)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to create task'
      return false
    } finally {
      loading.value = false
    }

  }

  // -----------------------------------------------------------------------
  // TODO 2: implement updateTask(id, payload)
  // Same pattern as createTask, but call taskService.update(id, payload).
  // -----------------------------------------------------------------------
  async function updateTask(_id: number, _payload: TaskPayload): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const updatedTask = await taskService.update(_id, _payload)

      if (tasks.value) {
        const index = tasks.value.findIndex(task => task.id === _id);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }
      }

      await fetchTasks();
      return true;
    } catch (err) {
      console.error('Failed to update task:', err);
      error.value = err instanceof Error ? err.message : 'Update failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // -----------------------------------------------------------------------
  // TODO 3: implement deleteTask(id)
  // Same pattern, but call taskService.remove(id). No payload needed.
  // Remember: this should also re-fetch the list afterwards.
  // -----------------------------------------------------------------------
  async function deleteTask(_id: number) {
    // TODO: replace this with a real implementation
    throw new Error('TODO: implement deleteTask in stores/tasks.ts')
  }

  // Provided for you: a small "quick toggle" action so you can see a
  // working example of updating one field without opening the full form.
  async function updateTaskStatus(id: number, status: TaskStatus) {
    loading.value = true
    error.value = null
    try {
      await taskService.updateStatus(id, status)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task status.'
      return false
    } finally {
      loading.value = false
    }
  }

  // -----------------------------------------------------------------------
  // TODO 4: implement setFilters(newFilters) and resetFilters()
  //
  // setFilters should:
  //   - merge newFilters into filters.value
  //   - reset filters.value.page back to 1 (whenever a filter changes,
  //     you want to start again from page 1)
  //   - call fetchTasks() so the table updates immediately
  //
  // resetFilters should restore filters.value to the default shown in
  // the `filters` ref above, then call fetchTasks().
  // -----------------------------------------------------------------------
  function setFilters(_newFilters: Partial<TaskFilters>) {
    // TODO: replace this with a real implementation
  }

  function resetFilters() {
    // TODO: replace this with a real implementation
  }

  return {
    tasks,
    currentTask,
    pagination,
    filters,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    resetFilters,
  }
})
