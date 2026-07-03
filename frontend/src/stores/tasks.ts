
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

  async function deleteTask(id: number): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await taskService.remove(id);
      await fetchTasks();
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete task';
      return false;
    } finally {
      loading.value = false;
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


  function setFilters(_newFilters: Partial<TaskFilters>) {
    filters.value = {
      ...filters.value,
      ..._newFilters,
      page: 1,
    };

    fetchTasks();
  }

  function resetFilters() {
    filters.value = {
      search: '',
      status: '',
      page: 1,
      limit: 10, 
    };

    fetchTasks();
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
