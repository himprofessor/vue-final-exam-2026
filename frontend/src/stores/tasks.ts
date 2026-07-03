import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskFilters, Pagination, TaskStatus } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const filters = ref<TaskFilters>({ status: '', category_id: '', search: '', page: 1, limit: 10 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalTasksCount = ref(0)
  const todoTaskCount = ref(0)
  const inProgressTaskCount = ref(0)
  const doneTaskCount = ref(0)

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
    calculateStatus()
  }
  function setFilters(newFilters: Partial<TaskFilters>) {
    filters.value = { ...filters.value, ...newFilters, page: 1}
    fetchTasks()
  }

  function resetFilters() {
    filters.value = { status: '', category_id: '', search: '', page: 1, limit: 10}
    fetchTasks()
  }

  function calculateStatus() {
    totalTasksCount.value = tasks.value.length
    todoTaskCount.value = tasks.value.filter(t => t.status === 'todo').length
    inProgressTaskCount.value = tasks.value.filter(t => t.status === 'in_progress').length
    doneTaskCount.value = tasks.value.filter(t => t.status === 'done').length
  }

  return {
    tasks,
    currentTask,
    pagination,
    filters,
    loading,
    error,
    totalTasksCount,
    todoTaskCount,
    inProgressTaskCount,
    doneTaskCount,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    resetFilters,
  }
})
