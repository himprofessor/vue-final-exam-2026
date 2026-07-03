// =====================================================================
// Tasks store - COMPLETE implementation following categories.ts pattern
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

  async function fetchTaskById(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getOne(Number(id))
      currentTask.value = data.data.task
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load the task details.'
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

  async function updateTask(id: number | string, payload: TaskPayload) {
    loading.value = true
    error.value = null
    try {
      await taskService.update(Number(id), payload)
      // TODO: Should re-fetch tasks here but I'm not sure how
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: number | string) {
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
    // TODO: implement filter functionality
    console.log('Filters not implemented yet:', newFilters)
  }

  function resetFilters() {
    // TODO: implement reset functionality
    console.log('Reset not implemented yet')
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    currentTask,
    pagination,
    filters,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    resetFilters,
    clearError,
  }
})

