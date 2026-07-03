import api from './api'
import type { ApiResponse, Task, TaskPayload, TaskFilters, Pagination, TaskStatus, TaskPriority } from '@/types'

export const taskService = {
  getAll(filters: TaskFilters) {
    return api.get<ApiResponse<{ tasks: Task[]; pagination: Pagination }>>('/tasks', {
      params: filters,
    })
  },

  getOne(id: number) {
    return api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`)
  },

//1 .create a new task//
  create(_payload: TaskPayload) {
    return api.post<ApiResponse<{ task: Task }>>('/tasks', _payload)
  },

//2.update an existing task//
  update(_id: number, _payload: Partial<TaskPayload>) {
    return api.put<ApiResponse<{ task: Task }>>(`/tasks/${_id}`, _payload)
  },

//3.update the status of a task//
  updateStatus(_id: number, status: TaskStatus) {
    return api.patch<ApiResponse<{ task: Task }>>(`/tasks/${_id}/status`, { status })
  },

//4.remove a task//
  remove(_id: number) {
    return api.delete<ApiResponse<null>>(`/tasks/${_id}`)
  },
}





