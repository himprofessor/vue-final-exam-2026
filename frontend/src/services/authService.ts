import api from './api'
import type { ApiResponse, User } from '@/types'

interface AuthData {
  user: User
  token: string
}

export const authService = {
  login(email: string, password: string) {
    return api.post<ApiResponse<AuthData>>('/auth/login', { email, password })
  },

  register(name: string, email: string, password: string) {
    return api.post<ApiResponse<AuthData>>('/auth/register', { name, email, password })
  },

  me() {
    return api.get<ApiResponse<{ user: User }>>('/auth/me')
  },
}

