// =====================================================================
// Categories store - COMPLETE reference implementation.
//
// This store is fully working on purpose: use it as the PATTERN to
// follow when you complete stores/tasks.ts. Notice the shape every
// action follows:
//   1. set loading = true, clear error
//   2. try { call the service, update state }
//   3. catch { set a friendly error message }
//   4. finally { loading = false }
// =====================================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '@/services/categoryService'
import type { Category, CategoryPayload } from '@/types'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const { data } = await categoryService.getAll()
      categories.value = data.data.categories
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load categories.'
    } finally {
      loading.value = false
    }
  }

  async function createCategory(payload: CategoryPayload) {
    loading.value = true
    error.value = null
    try {
      await categoryService.create(payload)
      await fetchCategories() // re-fetch so the list (and any task dropdowns) stay in sync
      return true
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id: number, payload: CategoryPayload) {
    loading.value = true
    error.value = null
    try {
      await categoryService.update(id, payload)
      await fetchCategories()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: number) {
    loading.value = true
    error.value = null
    try {
      await categoryService.remove(id)
      await fetchCategories()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category.'
      return false
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
})
