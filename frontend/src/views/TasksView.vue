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
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tasks</h1>
        <p class="text-sm text-gray-500">Manage and track all of your tasks.</p>
      </div>
      <BaseButton @click="openCreateModal">+ New Task</BaseButton>
    </div>

    <!-- Filters -->
    <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
