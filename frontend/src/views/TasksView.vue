<script setup lang="ts">
// =====================================================================
// Main exam page. The UI/markup here is complete, but it calls actions
// on the tasks store (createTask/updateTask/deleteTask/setFilters/
// resetFilters) that you still need to implement in stores/tasks.ts.
//
// Until those TODOs are done, creating/editing/deleting/filtering
// tasks will fail - that's expected. Use CategoriesView.vue as your
// reference for the exact pattern to follow.
// =====================================================================
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskRow from '@/components/tasks/TaskRow.vue'
import type { Task, TaskPayload, TaskStatus } from '@/types'

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const isModalOpen = ref(false)
const editingTask = ref<Task | null>(null)
const isConfirmOpen = ref(false)
const taskToDelete = ref<Task | null>(null)

onMounted(() => {
  taskStore.fetchTasks()
  categoryStore.fetchCategories()
})

function openCreateModal() {
  editingTask.value = null
  isModalOpen.value = true
}

function openEditModal(task: Task) {
  editingTask.value = task
  isModalOpen.value = true
}

async function handleSubmit(payload: TaskPayload) {
  // TODO (depends on stores/tasks.ts TODO 1 & 2):
  // once createTask/updateTask are implemented, this will work as-is.
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
  // TODO (depends on stores/tasks.ts TODO 3): implement deleteTask first.
  const success = await taskStore.deleteTask(taskToDelete.value.id)
  if (success) {
    isConfirmOpen.value = false
    taskToDelete.value = null
  }
}

function handleStatusChange(id: number, status: TaskStatus) {
  taskStore.updateTaskStatus(id, status)
}

// TODO (depends on stores/tasks.ts TODO 4): implement setFilters/resetFilters
// so these actually re-fetch the list from the API.
function handleStatusFilter(value: string) {
  taskStore.setFilters({ status: value as TaskStatus | '' })
}

function handleCategoryFilter(value: string) {
  taskStore.setFilters({ category_id: value ? Number(value) : '' })
}

function goToPage(page: number) {
  taskStore.setFilters({ page })
}

const statusFilterOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <!-- Header Section -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Tasks</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">Manage and track all of your tasks.</p>
      </div>
      <BaseButton @click="openCreateModal" class="w-full sm:w-auto justify-center">
        + New Task
      </BaseButton>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <BaseSelect
        :model-value="taskStore.filters.status || ''"
        placeholder="All statuses"
        :options="statusFilterOptions"
        @update:model-value="handleStatusFilter"
        class="w-full"
      />
      <BaseSelect
        :model-value="taskStore.filters.category_id || ''"
        placeholder="All categories"
        :options="categoryStore.categories.map((c) => ({ value: c.id, label: c.name }))"
        @update:model-value="handleCategoryFilter"
        class="w-full"
      />
    </div>

    <!-- Feedback States -->
    <ErrorAlert
      v-if="taskStore.error"
      :message="taskStore.error"
      class="mb-4"
      @dismiss="taskStore.error = null"
    />

    <LoadingSpinner v-if="taskStore.loading && !taskStore.tasks.length" label="Loading tasks..." />

    <EmptyState
      v-else-if="!taskStore.tasks.length"
      title="No tasks found"
      message="Create a task or adjust your filters."
    >
      <template #action>
        <BaseButton @click="openCreateModal" class="w-full sm:w-auto">+ New Task</BaseButton>
      </template>
    </EmptyState>

    <!-- Main Content Layout Split -->
    <div v-else class="w-full">
      
      <!-- 1. MOBILE/TABLET VIEW (Cards) - Shows below 768px -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div 
          v-for="task in taskStore.tasks" 
          :key="'mobile-' + task.id" 
          class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-gray-300 transition"
        >
          <!-- Top Row -->
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="min-w-0 flex-1">
              <h3 class="font-medium text-gray-900 break-words text-base">{{ task.title }}</h3>
              <p v-if="task.description" class="text-xs text-gray-500 mt-1 line-clamp-2">
                {{ task.description }}
              </p>
            </div>
            <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 shrink-0">
              {{ task.status }}
            </span>
          </div>
          
          <!-- Metadata Badges -->
          <div class="flex flex-wrap gap-2 items-center text-xs pt-2 border-t border-gray-50">
            <span class="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700 border border-red-100">
              {{ task.priority }} Priority
            </span>
            <span v-if="task.category_id" class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700 border border-blue-100">
              ID: {{ task.category_id }}
            </span>
            <span v-if="task.due_date" class="text-gray-500 ml-auto flex items-center gap-1">
              Due: {{ task.due_date }}
            </span>
          </div>

          <!-- Actions Footer -->
          <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
            <button 
              @click="openEditModal(task)" 
              class="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit
            </button>
            <button 
              @click="askDelete(task)" 
              class="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- 2. DESKTOP VIEW (Table) - Shows from 768px (md) and up -->
      <div class="hidden md:block w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full table-auto text-left border-collapse">
            <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th class="px-6 py-4 min-w-[200px]">Title</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Priority</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Due</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
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
      </div>

    </div>

    <!-- Pagination Section -->
    <div v-if="taskStore.pagination.totalPages > 1" class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
      <span class="text-center sm:text-left">Page {{ taskStore.pagination.page }} of {{ taskStore.pagination.totalPages }}</span>
      <div class="flex gap-2 w-full sm:w-auto">
        <BaseButton
          variant="secondary"
          :disabled="taskStore.pagination.page <= 1"
          @click="goToPage(taskStore.pagination.page - 1)"
          class="flex-1 sm:flex-none justify-center"
        >
          Previous
        </BaseButton>
        <BaseButton
          variant="secondary"
          :disabled="taskStore.pagination.page >= taskStore.pagination.totalPages"
          @click="goToPage(taskStore.pagination.page + 1)"
          class="flex-1 sm:flex-none justify-center"
        >
          Next
        </BaseButton>
      </div>
    </div>

    <!-- Modal forms -->
    <BaseModal v-model="isModalOpen" :title="editingTask ? 'Edit Task' : 'New Task'">
      <div class="max-w-full overflow-y-auto max-h-[85vh] p-1">
        <TaskForm
          :task="editingTask"
          :categories="categoryStore.categories"
          :loading="taskStore.loading"
          @submit="handleSubmit"
          @cancel="isModalOpen = false"
        />
      </div>
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

