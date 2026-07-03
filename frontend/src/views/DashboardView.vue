<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

onMounted(() => {
  taskStore.fetchTasks()
  categoryStore.fetchCategories()
})

const counts = computed(() => ({
  total: taskStore.pagination.total,
  todo: taskStore.tasks.filter((t) => t.status === 'todo').length,
  inProgress: taskStore.tasks.filter((t) => t.status === 'in_progress').length,
  done: taskStore.tasks.filter((t) => t.status === 'done').length,
}))
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Welcome back, {{ authStore.user?.name }} 👋</h1>
    <p class="mb-6 text-sm text-gray-500">Here's a quick overview of your tasks.</p>

    <LoadingSpinner v-if="taskStore.loading" label="Loading dashboard..." />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card p-5">
        <p class="text-sm text-gray-500">Total Tasks</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ counts.total }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-gray-500">To Do</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ counts.todo }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-gray-500">In Progress</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ counts.inProgress }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-gray-500">Done</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ counts.done }}</p>
      </div>
    </div>

    <div class="mt-8 card p-5">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">Categories</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="category in categoryStore.categories"
          :key="category.id"
          class="rounded-full px-3 py-1 text-xs font-medium"
          :style="{ backgroundColor: category.color + '20', color: category.color }"
        >
          {{ category.name }}
        </span>
      </div>
    </div>
  </div>
</template>
