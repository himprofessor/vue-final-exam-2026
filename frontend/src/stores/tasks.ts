
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskFilters, Pagination, TaskStatus } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  // ---- state -----------------------------------------------------------

  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const filters = ref<TaskFilters>({
    status: undefined,
    category_id: undefined,
    search: '',
    page: 1,
    limit: 10
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- actions -----------------------------------------------------------

  // add all tasks to done status

  async function markAllTasksAsDone() {
    loading.value = true
    error.value = null
    try {
      const promises = tasks.value.map(task => (
        taskService.updateStatus(task.id, 'done')
      ))
      await Promise.all(promises)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to mark tasks as done.'
    } finally {
      loading.value = false
    }
  }

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

  async function createTask(_payload: TaskPayload) {
   
    loading.value = true
    error.value = null
    try {
      await taskService.create(_payload)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message
      return false
    } finally {
      loading.value = false
    }
  }

  // -----------------------------------------------------------------------

  async function updateTask(_id: number, _payload: TaskPayload) {
    loading.value = true
    error.value = null
    try {
      await taskService.update(_id, _payload)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task.'
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
      error.value = err.response?.data?.message || 'Failed to delete task.'
      return false
    } finally {
      loading.value = false
    }
  }
  async function updateTaskStatus(_id: number, _status: TaskStatus) {
    loading.value = true
    error.value = null
    try {
      await taskService.updateStatus(_id, _status)
      await fetchTasks()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task status.'
      return false
    } finally {
      loading.value = false
    }
  };

  function setFilters(_newFilters: Partial<TaskFilters>) {
    filters.value = { 
      ...filters.value, 
      ..._newFilters, 
      page: _newFilters.page ?? 1, 
      limit: _newFilters.limit ?? 10
    }
    fetchTasks()

  }

  function resetFilters() {
    filters.value = {
      status: undefined,
      category_id: undefined,
      search: '',
      page: 1,
      limit: 10
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
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  markAllTasksAsDone,
  setFilters,
  resetFilters,
}
});
