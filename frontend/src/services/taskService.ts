import api from './api'
import type { ApiResponse, Task, TaskPayload, TaskFilters, PaginatedTasks } from '@/types'

export const taskService = {
  getAll(filters: TaskFilters) {
    return api.get<ApiResponse<PaginatedTasks>>('/tasks', {
      params: filters,
    })
  },

  getOne(id: number) {
    return api.get<ApiResponse<Task>>(`/tasks/${id}`)
  },

  create(payload: TaskPayload) {
    return api.post<ApiResponse<Task>>('/tasks', payload)
  },

  update(id: number, payload: TaskPayload) {
    return api.put<ApiResponse<Task>>(`/tasks/${id}`, payload)
  },

  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status })
  },

  remove(id: number) {
    return api.delete<ApiResponse<null>>(`/tasks/${id}`)
  },
}
