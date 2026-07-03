<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { Task } from '@/types'

const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const dashboardTasks = ref<Task[]>([])
const dashboardLoading = ref(true)
const dashboardError = ref<string | null>(null)

onMounted(async () => {
  categoryStore.fetchCategories()
  await fetchDashboardData()
})

async function fetchDashboardData() {
  dashboardLoading.value = true
  dashboardError.value = null
  try {
    // Fetch a large batch so stats are meaningful
    const { data } = await taskService.getAll({ page: 1, limit: 100 })
    dashboardTasks.value = data.data.tasks
  } catch (err: any) {
    dashboardError.value = err.response?.data?.message || 'Failed to load dashboard data.'
  } finally {
    dashboardLoading.value = false
  }
}

// ---- Stats ---------------------------------------------------------------
const totalTasks = computed(() => dashboardTasks.value.length)

const todoCount = computed(() =>
  dashboardTasks.value.filter((t) => t.status === 'todo').length
)
const inProgressCount = computed(() =>
  dashboardTasks.value.filter((t) => t.status === 'in_progress').length
)
const doneCount = computed(() =>
  dashboardTasks.value.filter((t) => t.status === 'done').length
)

const completionRate = computed(() =>
  totalTasks.value > 0 ? Math.round((doneCount.value / totalTasks.value) * 100) : 0
)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Welcome back, {{ authStore.user?.name }} 👋</h1>
      <p class="text-sm text-gray-500">{{ formatDate(new Date().toISOString()) }} &middot; Here's your overview.</p>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="dashboardLoading" label="Loading dashboard..." />

    <!-- Error -->
    <div
      v-else-if="dashboardError"
      class="card p-6 text-center"
    >
      <p class="text-red-600">{{ dashboardError }}</p>
      <button
        class="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
        @click="fetchDashboardData"
      >
        Try again
      </button>
    </div>

    <template v-else>
      <!-- === Stat cards === -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total -->
        <div class="card p-5 transition-shadow hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Total Tasks</p>
              <p class="mt-0.5 text-2xl font-bold text-gray-900">{{ totalTasks }}</p>
            </div>
          </div>
        </div>

        <!-- To Do -->
        <div class="card p-5 transition-shadow hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-gray-400">To Do</p>
              <p class="mt-0.5 text-2xl font-bold text-gray-900">{{ todoCount }}</p>
            </div>
          </div>
        </div>

        <!-- In Progress -->
        <div class="card p-5 transition-shadow hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-gray-400">In Progress</p>
              <p class="mt-0.5 text-2xl font-bold text-gray-900">{{ inProgressCount }}</p>
            </div>
          </div>
        </div>

        <!-- Done -->
        <div class="card p-5 transition-shadow hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Done</p>
              <p class="mt-0.5 text-2xl font-bold text-gray-900">{{ doneCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion progress -->
      <div class="mt-6 card p-5">
        <h2 class="mb-1 text-sm font-semibold text-gray-900">Completion</h2>
        <p class="mb-3 text-xs text-gray-400">{{ doneCount }} of {{ totalTasks }} tasks done</p>
        <div class="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            class="h-full rounded-full bg-green-500 transition-all duration-700 ease-out"
            :style="{ width: completionRate + '%' }"
          />
        </div>
        <p class="mt-1.5 text-right text-xs font-medium text-green-600">{{ completionRate }}%</p>

        <!-- Status breakdown bar -->
        <div v-if="totalTasks > 0" class="mt-4 flex h-4 overflow-hidden rounded-full bg-gray-100">
          <div
            class="bg-amber-400 transition-all duration-700"
            :style="{ width: (todoCount / totalTasks) * 100 + '%' }"
            :title="'To Do: ' + todoCount"
          />
          <div
            class="bg-blue-400 transition-all duration-700"
            :style="{ width: (inProgressCount / totalTasks) * 100 + '%' }"
            :title="'In Progress: ' + inProgressCount"
          />
          <div
            class="bg-green-400 transition-all duration-700"
            :style="{ width: (doneCount / totalTasks) * 100 + '%' }"
            :title="'Done: ' + doneCount"
          />
        </div>
        <div class="mt-2 flex gap-4 text-xs text-gray-400">
          <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-amber-400" /> Todo {{ todoCount }}</span>
          <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-blue-400" /> In progress {{ inProgressCount }}</span>
          <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-green-400" /> Done {{ doneCount }}</span>
        </div>
      </div>

      <!-- Categories -->
      <div class="mt-6 card p-5">
        <h2 class="mb-3 text-sm font-semibold text-gray-900">Categories</h2>
        <div v-if="!categoryStore.categories.length" class="py-3 text-center text-sm text-gray-400">
          No categories yet.
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="category in categoryStore.categories"
            :key="category.id"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            :style="{ backgroundColor: category.color + '18', color: category.color }"
          >
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: category.color }" />
            {{ category.name }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
