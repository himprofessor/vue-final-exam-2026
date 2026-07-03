// =====================================================================
// Tasks store - THIS IS YOUR MAIN EXAM TASK.
//
// The `categories` store (stores/categories.ts) is a complete working
// example. This file follows the same request/loading/error pattern for
// task CRUD and filtering.
// =====================================================================
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskFilters, Pagination, TaskStatus } from '@/types'

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message || fallback
  }
  return fallback
}

export const useTaskStore = defineStore('tasks', () => {
  // ---- state -----------------------------------------------------------
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const defaultFilters = (): TaskFilters => ({ status: '', category_id: '', search: '', page: 1, limit: 10 })
  const filters = ref<TaskFilters>(defaultFilters())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- actions -----------------------------------------------------------

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getAll(filters.value)
      tasks.value = data.data.tasks
      pagination.value = data.data.pagination
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to load tasks.')
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: TaskPayload) {
    loading.value = true
    error.value = null
    try {
      await taskService.create(payload)
      await fetchTasks()
      return true
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to create task.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: number, payload: TaskPayload) {
    loading.value = true
    error.value = null
    try {
      await taskService.update(id, payload)
      await fetchTasks()
      return true
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to update task.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: number) {
    loading.value = true
    error.value = null
    try {
      await taskService.remove(id)
      await fetchTasks()
      return true
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to delete task.')
      return false
    } finally {
      loading.value = false
    }
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
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to update task status.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function setFilters(newFilters: Partial<TaskFilters>) {
    filters.value = {
      ...filters.value,
      ...newFilters,
      page: newFilters.page ?? 1,
    }
    await fetchTasks()
  }

  async function resetFilters() {
    filters.value = defaultFilters()
    await fetchTasks()
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
