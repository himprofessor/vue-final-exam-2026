import api from './api'
import type { ApiResponse, Task, TaskPayload, TaskFilters, Pagination } from '@/types'

export const taskService = {
  getAll(filters: TaskFilters) {
    // Wrapped in an inner data property to match data.data.tasks in your store
    return api.get<ApiResponse<{ data: { tasks: Task[]; pagination: Pagination } }>>('/tasks', {
      params: filters,
    })
  },

  getOne(id: number) {
    return api.get<ApiResponse<{ data: { task: Task } }>>(`/tasks/${id}`)
  },

  create(payload: TaskPayload) {
    return api.post<ApiResponse<{ data: { task: Task } }>>('/tasks', payload)
  },

  update(id: number, payload: TaskPayload) {
    return api.put<ApiResponse<{ data: { task: Task } }>>(`/tasks/${id}`, payload)
  },

  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ data: { task: Task } }>>(`/tasks/${id}/status`, { status })
  },

  remove(id: number) {
    return api.delete(`/tasks/${id}`)
  },
}