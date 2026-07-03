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

  create(_payload: TaskPayload): Promise<ApiResponse<{ task: Task }>>{
    return api.post('/tasks', _payload);
  },

  update(id: number, payload: TaskPayload) {
    return api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, payload)
  },

  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status })
  },

  remove(_id: number) {
     return api.delete<ApiResponse<void>>(`/tasks/${_id}`)
  },
}
