// =====================================================================
// Central axios instance.
// Every service file (authService, taskService, categoryService) imports
// THIS instance instead of importing axios directly. That way the
// base URL and auth header logic only need to be configured once.
// =====================================================================
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// If the API ever responds with 401 (expired/invalid token), log the
// user out and send them back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default api
