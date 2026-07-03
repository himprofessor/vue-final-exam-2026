import api from './api'
import type { ApiResponse, Task, TaskPayload, TaskFilters, Pagination } from '@/types'

export const taskService = {
  getAll(filters: TaskFilters) {
    return api.get<ApiResponse<{ tasks: Task[]; pagination: Pagination }>>('/tasks', {
      params: filters,
    })
  },

  getOne(id: number) {
    return api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`)
  },

  // create
  create(payload: TaskPayload) {
    return api.post<ApiResponse<{ task: Task }>>('/tasks', payload)
  },

  // update
  update(id: number, payload: TaskPayload) {
    return api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, payload)
  },

  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status })
  },

  // remove
  remove(id: number) {
    return api.delete<ApiResponse<null>>(`/tasks/${id}`)
  },
}
