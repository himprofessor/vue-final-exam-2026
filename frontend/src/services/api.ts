import axios from 'axios'

// 1. Create the base configuration pointing to your backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. FIX THE NOT AUTHENTICATED BUG HERE:
// Add a request interceptor to automatically attach the token on every single network call
api.interceptors.request.use(
  (config) => {
    // Look up the token string that your authStore saved inside localStorage
    const token = localStorage.getItem('taskflow_token')
    
    // If a token exists, inject it securely into the Authorization header slot
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
