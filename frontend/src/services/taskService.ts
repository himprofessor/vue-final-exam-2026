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

  // CREATE
  create(_payload: TaskPayload) {
    return api.post<ApiResponse<{ task: Task}>>('/tasks', _payload)
  },

  // UPDATE & UPDATE STATUS
  update(_id: number, _payload: TaskPayload) {
    return api.put<ApiResponse<{ task: Task }>>(`/tasks/${_id}`, _payload)
  },
  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status })
  },

  // REMOVE
  remove(_id: number) {
    return api.delete<ApiResponse<null>>(`/tasks/${_id}`)
  },
}
