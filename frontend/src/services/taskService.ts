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
  // TODO: implement `create`.
  // Hint: POST to '/tasks' with the payload, same shape as
  // categoryService.create() above. Return type should be
  // ApiResponse<{ task: Task }>.
  create(_payload: TaskPayload) {
    // throw new Error('TODO: implement taskService.create')
    return api.post<ApiResponse<{ task: Task }>>('/tasks', _payload)
  },
  // TODO: implement `update`.
  // Hint: PUT to `/tasks/${id}` with the payload.
  update(id: number, _payload: TaskPayload) {
    return api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, _payload)
  },
  updateStatus(id: number, status: Task['status']) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status })
  },
  // TODO: implement `remove`.
  // Hint: DELETE `/tasks/${id}`.
  remove(_id: number) {
    return api.delete<ApiResponse<{ task: Task }>>(`/tasks/${_id}`)
  },
}