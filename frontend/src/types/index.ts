export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

export interface Category {
  id: number
  name: string
  color: string
  created_at: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  user_id: number
  category_id: number | null
  category_name: string | null
  category_color: string | null
  owner_name: string | null
  created_at: string
  updated_at: string
}

// Payload shape used when creating/updating a task from a form.
export interface TaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  category_id?: number | null
}

export interface CategoryPayload {
  name: string
  color?: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TaskFilters {
  status?: TaskStatus | ''
  category_id?: number | ''
  search?: string
  page?: number
  limit?: number
}

// Generic wrapper matching the backend's { success, message, data } envelope
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}
