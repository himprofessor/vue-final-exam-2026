<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import type { Task, TaskStatus, TaskFilters } from '@/types'

const authStore = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)
const tasks = ref<Task[]>([])
const pagination = ref({ total: 0, page: 1, limit: 10, totalPages: 0 })

const statusFilter = ref<TaskStatus | ''>('')
const statusFilterOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const priorityColor: Record<Task['priority'], string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
}

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

onMounted(() => {
  fetchAllTasks()
})

async function fetchAllTasks() {
  loading.value = true
  error.value = null
  try {
    const filters: TaskFilters & { user_id?: number } = {
      page: pagination.value.page,
      limit: pagination.value.limit,
    }
    if (statusFilter.value) filters.status = statusFilter.value
    const { data } = await taskService.getAllAdmin(filters)
    tasks.value = data.data.tasks
    pagination.value = data.data.pagination
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

function handleStatusFilter(value: string) {
  statusFilter.value = value as TaskStatus | ''
  pagination.value.page = 1
  fetchAllTasks()
}

function goToPage(page: number) {
  pagination.value.page = page
  fetchAllTasks()
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">All Tasks (Admin)</h1>
        <p class="text-sm text-gray-500">View tasks across all users.</p>
      </div>
    </div>

    <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <BaseSelect
        :model-value="statusFilter"
        placeholder="All statuses"
        :options="statusFilterOptions"
        @update:model-value="handleStatusFilter"
      />
    </div>

    <ErrorAlert v-if="error" :message="error" class="mb-4" @dismiss="error = null" />

    <LoadingSpinner v-if="loading && !tasks.length" label="Loading tasks..." />

    <EmptyState
      v-else-if="!tasks.length"
      title="No tasks found"
      message="No tasks match the current filters."
    />

    <div v-else class="card overflow-x-auto">
      <table class="w-full text-left">
        <thead class="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-4 py-3 font-medium">Title</th>
            <th class="px-4 py-3 font-medium">Owner</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Priority</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Due</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
              <p v-if="task.description" class="line-clamp-1 text-xs text-gray-500">{{ task.description }}</p>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ task.owner_name || '—' }}</td>
            <td class="px-4 py-3">
              <BaseBadge v-if="task.category_name" :text="task.category_name" :color="task.category_color || '#6366f1'" />
              <span v-else class="text-xs text-gray-400">No category</span>
            </td>
            <td class="px-4 py-3">
              <BaseBadge :text="task.priority" :color="priorityColor[task.priority]" />
            </td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="{
                  'bg-gray-100 text-gray-600': task.status === 'todo',
                  'bg-blue-100 text-blue-700': task.status === 'in_progress',
                  'bg-green-100 text-green-700': task.status === 'done',
                }"
              >
                {{ statusLabel[task.status] }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ task.due_date || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination.totalPages > 1" class="mt-4 flex items-center justify-between text-sm text-gray-500">
      <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
      <div class="flex gap-2">
        <BaseButton
          variant="secondary"
          :disabled="pagination.page <= 1"
          @click="goToPage(pagination.page - 1)"
        >
          Previous
        </BaseButton>
        <BaseButton
          variant="secondary"
          :disabled="pagination.page >= pagination.totalPages"
          @click="goToPage(pagination.page + 1)"
        >
          Next
        </BaseButton>
      </div>
    </div>
  </div>
</template>