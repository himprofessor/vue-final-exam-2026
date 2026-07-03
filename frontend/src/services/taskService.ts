import api from './api'
import type { ApiResponse, Task, TaskPayload, TaskFilters, Pagination } from '@/types'

// -----------------------------------------------------------------------
// TODO (student task): This service file is DELIBERATELY incomplete.
// Follow the pattern in categoryService.ts to finish it.
// -----------------------------------------------------------------------
export const taskService = {
  getAll(filters: TaskFilters) {
    return api.get<ApiResponse<{ tasks: Task[]; pagination: Pagination }>>('/tasks', {
      params: filters,
    })
  },

  getOne(id: number) {
    return api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`)
  },

  //Create Task
  create(payload: TaskPayload) {
    return api.post<ApiResponse<{ task: Task }>>('/tasks', payload)
  },
  //Update Task
  update(id: number, payload: TaskPayload) {
    return api.put<ApiResponse<{ category: Task }>>(`/tasks/${id}`, payload)
  },
  //Update Status
  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status })
  },
  //Remove Task
  remove(id: number) {
    return api.delete<ApiResponse<null>>(`/tasks/${id}`)
  },
}
