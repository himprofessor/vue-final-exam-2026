import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskFilters, Pagination } from '@/types'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 })
  const filters = ref<TaskFilters & { sortBy?: string; sortOrder?: 'asc' | 'desc' }>({
    status: undefined,
    category_id: undefined,
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'due_date',
    sortOrder: 'asc'
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getAll(filters.value)
      tasks.value = data.data.tasks
      pagination.value = data.data.pagination || { total: data.data.tasks.length, page: 1, limit: 10, totalPages: 1 }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tasks. Please try again.'
      return false
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

  async function changeStatus(id: number, status: Task['status']) {
    try {
      await taskService.updateStatus(id, status)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index].status = status
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task status.'
      return false
    }
  }

  async function deleteTask(id: number) {
    error.value = null
    try {
      await taskService.remove(id)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task.'
      return false
    }
  }

  function setFilters(newFilters: Partial<TaskFilters & { sortBy?: string; sortOrder?: 'asc' | 'desc' }>) {
    filters.value = { ...filters.value, ...newFilters, page: 1 }
    fetchTasks()
  }

  function resetFilters() {
    filters.value = {
      status: undefined,
      category_id: undefined,
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'due_date',
      sortOrder: 'asc'
    }
    fetchTasks()
  }

  return { 
    tasks, pagination, filters, loading, error, 
    fetchTasks, createTask, updateTask, changeStatus, deleteTask, setFilters, resetFilters 
  }
})
