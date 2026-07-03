
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // ---- state -----------------------------------------------------------
  const user = ref<User | null>(JSON.parse(localStorage.getItem('taskflow_user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('taskflow_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- getters -----------------------------------------------------------
  const isAuthenticated = computed(() => !!token.value)

  // ---- helpers -----------------------------------------------------------
  function persistSession(newUser: User, newToken: string) {
    user.value = newUser
    token.value = newToken
    localStorage.setItem('taskflow_user', JSON.stringify(newUser))
    localStorage.setItem('taskflow_token', newToken)
  }

  // ---- actions -----------------------------------------------------------
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.login(email, password)
      persistSession(data.data.user, data.data.token)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.register(name, email, password)
      persistSession(data.data.user, data.data.token)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('taskflow_user')
    localStorage.removeItem('taskflow_token')
  }

  return { 
    user, 
    token, 
    loading, 
    error, 
    isAuthenticated, 
    login, 
    register, 
    logout }
})
