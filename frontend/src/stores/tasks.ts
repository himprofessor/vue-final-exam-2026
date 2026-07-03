// =====================================================================
// Tasks store - manages task CRUD, filtering, pagination, and bulk actions.
// =====================================================================
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskFilters, Pagination, TaskStatus } from '@/types'

interface BulkFilters {
  status?: string
  category_id?: string
  search?: string
}

export const useTaskStore = defineStore('tasks', () => {
  // ---- state -----------------------------------------------------------
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const filters = ref<TaskFilters>({ status: '', category_id: '', search: '', page: 1, limit: 10, sort_by: '', sort_order: 'desc' })
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

  async function fetchAllTasks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getAll({ limit: 999, page: 1, sort_by: '', sort_order: 'desc' })
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
      error.value = err.response?.data?.message || 'Failed to create task'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateTask(_id: number, _payload: TaskPayload) {
    loading.value = true
    error.value = null
    try {
      await taskService.update(_id, _payload)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(_id: number) {
    loading.value = true
    error.value = null
    try {
      await taskService.remove(_id)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
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

  async function bulkMarkDone(filters: BulkFilters) {
    loading.value = true
    error.value = null
    try {
      await taskService.bulkMarkDone(filters)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to mark tasks as done.'
      return false
    } finally {
      loading.value = false
    }
  }

  function setFilters(_newFilters: Partial<TaskFilters>) {
    const targetPage = _newFilters.page !== undefined ? _newFilters.page : 1
    filters.value = {
      ...filters.value,
      ..._newFilters,
      page: targetPage
    }
    fetchTasks()
  }

  function resetFilters() {
    filters.value = { 
      status: '',
      category_id: '',
      search: '',
      page: 1,
      limit: 10,
      sort_by: '',
      sort_order: 'desc',
    }
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
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    bulkMarkDone,
    setFilters,
    resetFilters,
  }
})
