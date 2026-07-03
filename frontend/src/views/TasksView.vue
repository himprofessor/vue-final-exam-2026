<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskRow from '@/components/tasks/TaskRow.vue'
import type { Task, TaskPayload, TaskStatus, TaskFilters } from '@/types'

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const route = useRoute()
const router = useRouter()

const isModalOpen = ref(false)
const editingTask = ref<Task | null>(null)
const isConfirmOpen = ref(false)
const taskToDelete = ref<Task | null>(null)
const searchInput = ref('')

onMounted(() => {
  const q = route.query
  const initial: Partial<TaskFilters> = {}
  if (q.status) initial.status = q.status as TaskStatus
  if (q.category_id) initial.category_id = Number(q.category_id)
  if (q.search) {
    initial.search = q.search as string
    searchInput.value = q.search as string
  }
  if (q.sort_by) initial.sort_by = q.sort_by as 'due_date' | 'priority'
  if (q.sort_order) initial.sort_order = q.sort_order as 'asc' | 'desc'
  if (q.page) initial.page = Number(q.page)

  taskStore.setFilters(initial)
  categoryStore.fetchCategories()
})

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    taskStore.setFilters({ search: val || '' })
    syncFiltersToUrl()
  }, 300)
})

function syncFiltersToUrl() {
  const q: Record<string, string> = {}
  if (taskStore.filters.status) q.status = taskStore.filters.status
  if (taskStore.filters.category_id) q.category_id = String(taskStore.filters.category_id)
  if (taskStore.filters.search) q.search = taskStore.filters.search
  if (taskStore.filters.sort_by) q.sort_by = taskStore.filters.sort_by
  if (taskStore.filters.sort_order && taskStore.filters.sort_order !== 'desc') q.sort_order = taskStore.filters.sort_order
  if (taskStore.filters.page && taskStore.filters.page > 1) q.page = String(taskStore.filters.page)
  router.replace({ query: q })
}

function openCreateModal() {
  editingTask.value = null
  isModalOpen.value = true
}

function openEditModal(task: Task) {
  editingTask.value = task
  isModalOpen.value = true
}

async function handleSubmit(payload: TaskPayload) {
  const success = editingTask.value
    ? await taskStore.updateTask(editingTask.value.id, payload)
    : await taskStore.createTask(payload)

  if (success) {
    isModalOpen.value = false
  }
}

function askDelete(task: Task) {
  taskToDelete.value = task
  isConfirmOpen.value = true
}

async function confirmDelete() {
  if (!taskToDelete.value) return
  const success = await taskStore.deleteTask(taskToDelete.value.id)
  if (success) {
    isConfirmOpen.value = false
    taskToDelete.value = null
  }
}

function handleStatusChange(id: number, status: TaskStatus) {
  taskStore.updateTaskStatus(id, status)
}

function handleStatusFilter(value: string) {
  taskStore.setFilters({ status: value as TaskStatus | '' })
  syncFiltersToUrl()
}

function handleCategoryFilter(value: string) {
  taskStore.setFilters({ category_id: value ? Number(value) : '' })
  syncFiltersToUrl()
}

function handleSortChange(sortBy: string) {
  if (sortBy === taskStore.filters.sort_by) {
    const next = taskStore.filters.sort_order === 'asc' ? 'desc' : 'asc'
    taskStore.setFilters({ sort_by: sortBy as 'due_date' | 'priority', sort_order: next })
  } else {
    taskStore.setFilters({ sort_by: sortBy as 'due_date' | 'priority', sort_order: 'asc' })
  }
  syncFiltersToUrl()
}

async function handleMarkAllDone() {
  await taskStore.bulkMarkDone({
    status: taskStore.filters.status || undefined,
    category_id: taskStore.filters.category_id ? String(taskStore.filters.category_id) : undefined,
    search: taskStore.filters.search || undefined,
  })
}

function goToPage(page: number) {
  taskStore.setFilters({ page })
  syncFiltersToUrl()
}

const statusFilterOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const sortOptions = [
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
]
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tasks</h1>
        <p class="text-sm text-gray-500">Manage and track all of your tasks.</p>
      </div>
      <BaseButton @click="openCreateModal">+ New Task</BaseButton>
    </div>

    <!-- Filters -->
    <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <BaseInput
        v-model="searchInput"
        placeholder="Search tasks..."
      />
      <BaseSelect
        :model-value="taskStore.filters.status || ''"
        placeholder="All statuses"
        :options="statusFilterOptions"
        @update:model-value="handleStatusFilter"
      />
      <BaseSelect
        :model-value="taskStore.filters.category_id || ''"
        placeholder="All categories"
        :options="categoryStore.categories.map((c) => ({ value: c.id, label: c.name }))"
        @update:model-value="handleCategoryFilter"
      />
      <div class="flex gap-2">
        <BaseSelect
          :model-value="taskStore.filters.sort_by || ''"
          placeholder="Sort by"
          :options="sortOptions"
          @update:model-value="handleSortChange"
        />
        <button
          v-if="taskStore.filters.sort_by"
          class="rounded-lg border border-gray-300 px-2 text-sm hover:bg-gray-100"
          @click="handleSortChange(taskStore.filters.sort_by)"
          :title="taskStore.filters.sort_order === 'asc' ? 'Ascending' : 'Descending'"
        >
          {{ taskStore.filters.sort_order === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <!-- Bulk actions -->
    <div class="mb-4 flex gap-2">
      <BaseButton
        variant="secondary"
        :disabled="!taskStore.tasks.length"
        :loading="taskStore.loading"
        @click="handleMarkAllDone"
      >
        Mark all as done
      </BaseButton>
    </div>

    <ErrorAlert v-if="taskStore.error" :message="taskStore.error" class="mb-4" @dismiss="taskStore.error = null" />

    <LoadingSpinner v-if="taskStore.loading && !taskStore.tasks.length" label="Loading tasks..." />

    <EmptyState
      v-else-if="!taskStore.tasks.length"
      title="No tasks found"
      message="Create a task or adjust your filters."
    >
      <template #action>
        <BaseButton @click="openCreateModal">+ New Task</BaseButton>
      </template>
    </EmptyState>

    <div v-else class="card overflow-x-auto">
      <table class="w-full text-left">
        <thead class="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-4 py-3 font-medium">Title</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Priority</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Due</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <TaskRow
            v-for="task in taskStore.tasks"
            :key="task.id"
            :task="task"
            @edit="openEditModal"
            @delete="askDelete"
            @status-change="handleStatusChange"
          />
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="taskStore.pagination.totalPages > 1" class="mt-4 flex items-center justify-between text-sm text-gray-500">
      <span>Page {{ taskStore.pagination.page }} of {{ taskStore.pagination.totalPages }}</span>
      <div class="flex gap-2">
        <BaseButton
          variant="secondary"
          :disabled="taskStore.pagination.page <= 1"
          @click="goToPage(taskStore.pagination.page - 1)"
        >
          Previous
        </BaseButton>
        <BaseButton
          variant="secondary"
          :disabled="taskStore.pagination.page >= taskStore.pagination.totalPages"
          @click="goToPage(taskStore.pagination.page + 1)"
        >
          Next
        </BaseButton>
      </div>
    </div>

    <BaseModal v-model="isModalOpen" :title="editingTask ? 'Edit Task' : 'New Task'">
      <TaskForm
        :task="editingTask"
        :categories="categoryStore.categories"
        :loading="taskStore.loading"
        @submit="handleSubmit"
        @cancel="isModalOpen = false"
      />
    </BaseModal>

    <ConfirmDialog
      v-model="isConfirmOpen"
      title="Delete task?"
      :message="`This will permanently delete '${taskToDelete?.title}'.`"
      :loading="taskStore.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
