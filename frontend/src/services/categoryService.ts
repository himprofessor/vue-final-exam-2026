import api from './api'
import type { ApiResponse, Category, CategoryPayload } from '@/types'

// This service is a COMPLETE reference implementation - study this file
// to understand the pattern you'll repeat (with a few extra pieces) in
// taskService.ts.
export const categoryService = {
  getAll() {
    return api.get<ApiResponse<{ categories: Category[] }>>('/categories')
  },

  create(payload: CategoryPayload) {
    return api.post<ApiResponse<{ category: Category }>>('/categories', payload)
  },

  update(id: number, payload: CategoryPayload) {
    return api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, payload)
  },

  remove(id: number) {
    return api.delete<ApiResponse<null>>(`/categories/${id}`)
  },
}



