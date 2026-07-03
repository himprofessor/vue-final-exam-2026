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
  const sortField = ref<TaskFilters['sort_by']>('created_at')
  const sortOrder = ref<TaskFilters['sort_order']>('desc')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- actions -----------------------------------------------------------

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getAll({
        ...filters.value,
        sort_by: sortField.value,
        sort_order: sortOrder.value,
      })
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
  }

  function setFilters(newFilters: Partial<TaskFilters>) {
    // Reset to page 1 only when a content filter changes,
    // not when the user explicitly navigates to a different page.
    const shouldResetPage = !('page' in newFilters)
    filters.value = { ...filters.value, ...newFilters }
    if (shouldResetPage) {
      filters.value.page = 1
    }
    fetchTasks()
  }

  function resetFilters() {
    filters.value = { status: '', category_id: '', search: '', page: 1, limit: 10 }
    fetchTasks()
  }

  async function markAllAsDone() {
    loading.value = true
    error.value = null
    try {
      // Update every task in the current list to "done" via PATCH status
      const promises = tasks.value
        .filter((t) => t.status !== 'done')
        .map((t) => taskService.updateStatus(t.id, 'done'))
      await Promise.all(promises)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to mark all as done.'
      return false
    } finally {
      loading.value = false
    }
  }

  function setSorting(field: NonNullable<TaskFilters['sort_by']>) {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
    fetchTasks()
  }

  return {
    tasks,
    currentTask,
    pagination,
    filters,
    sortField,
    sortOrder,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    resetFilters,
    markAllAsDone,
    setSorting,
  }
})
