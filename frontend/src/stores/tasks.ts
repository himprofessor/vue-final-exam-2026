import { defineStore } from "pinia";
import { ref } from "vue";
import { taskService } from "@/services/taskService";
import type {
  Task,
  TaskPayload,
  TaskFilters,
  Pagination,
  TaskStatus,
} from "@/types";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const filters = ref<TaskFilters>({
    status: "",
    category_id: "",
    search: "",
    page: 1,
    limit: 10,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch the tasks
  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await taskService.getAll(filters.value);
      tasks.value = data.data.tasks;
      pagination.value = data.data.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to load tasks.";
    } finally {
      loading.value = false;
    }
  }

  // Create task
  async function createTask(_payload: TaskPayload) {
    loading.value = true;
    error.value = null;
    try {
      await taskService.create(_payload);
      await fetchTasks();
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to create task.";
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update the task
  async function updateTask(_id: number, _payload: TaskPayload) {
    loading.value = true;
    error.value = null;
    try {
      await taskService.update(_id, _payload);
      await fetchTasks();
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update task.";
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete the task
  async function deleteTask(_id: number) {
    loading.value = true;
    error.value = null;
    try {
      await taskService.remove(_id);
      await fetchTasks();
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete task.";
      return false;
    } finally {
      loading.value = false;
    }
  }

  //Update task status
  async function updateTaskStatus(id: number, status: TaskStatus) {
    loading.value = true;
    error.value = null;
    try {
      await taskService.updateStatus(id, status);
      await fetchTasks();
      return true;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Failed to update task status.";
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Set filters the task
  function setFilters(_newFilters: Partial<TaskFilters>) {
    filters.value = { ...filters.value, ..._newFilters, page: 1 };
    fetchTasks();
  }

  // Reset filters
  function resetFilters() {
    filters.value = {
      status: "",
      category_id: "",
      search: "",
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
  };
});
