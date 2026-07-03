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

  async function createTask(payload: TaskPayload) {
    loading.value = true
    error.value = null
    try {
      await taskService.create(payload)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task.'
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task.'
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task.'
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task status.'
      return false
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<TaskFilters>) {
    filters.value = { ...filters.value, ...newFilters, page: 1 }
    fetchTasks()
  }

  function resetFilters() {
    filters.value = { status: '', category_id: '', search: '', page: 1, limit: 10 }
    fetchTasks()
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
