import api from './api'
import type { ApiResponse, Task, TaskPayload, TaskFilters, Pagination } from '@/types'

// -----------------------------------------------------------------------
// COMPLETE reference implementation for taskService.ts
// Handles all CRUD network requests for task management.
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

  // TODO: implement `create`.
  // Hint: POST to '/tasks' with the payload, same shape as
  // categoryService.create() above. Return type should be
  // ApiResponse<{ task: Task }>.
  create(payload: TaskPayload) { // FIXED: Removed underscore from payload
     return api.post<ApiResponse<{ task: Task }>>('/tasks', payload)
  },

  // TODO: implement `update`.
  // Hint: PUT to `/tasks/${id}` with the payload.
  update(id: number, payload: TaskPayload) { // FIXED: Removed underscores from id and payload
      return api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, payload)
  },

  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status })
  },

  // TODO: implement `remove`.
  // Hint: DELETE `/tasks/${id}`.
  remove(id: number) { // FIXED: Removed underscore from id
    return api.delete<ApiResponse<null>>(`/tasks/${id}`)
  },
}
