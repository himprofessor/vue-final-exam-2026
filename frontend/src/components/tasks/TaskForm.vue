<script setup lang="ts">
// This form component is fully wired up on the UI side. It emits a
// clean TaskPayload on submit - your job (see stores/tasks.ts TODOs)
// is to make sure something actually handles that payload end-to-end.
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Task, TaskPayload, Category } from '@/types'

const props = defineProps<{
  task?: Task | null
  categories: Category[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: TaskPayload): void
  (e: 'cancel'): void
}>()

const title = ref('')
const description = ref('')
const status = ref<Task['status']>('todo')
const priority = ref<Task['priority']>('medium')
const dueDate = ref('')
const categoryId = ref<string>('')
const titleError = ref('')

watch(
  () => props.task,
  (task) => {
    title.value = task?.title || ''
    description.value = task?.description || ''
    status.value = task?.status || 'todo'
    priority.value = task?.priority || 'medium'
    dueDate.value = task?.due_date || ''
    categoryId.value = task?.category_id ? String(task.category_id) : ''
  },
  { immediate: true }
)

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

function handleSubmit() {
  titleError.value = ''
  if (!title.value.trim()) {
    titleError.value = 'Title is required'
    return
  }

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    status: status.value,
    priority: priority.value,
    due_date: dueDate.value || null,
    category_id: categoryId.value ? Number(categoryId.value) : null,
  })
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <BaseInput v-model="title" label="Title" placeholder="e.g. Finish exam project" required :error="titleError" />

    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
      <textarea v-model="description" rows="3" class="input-field" placeholder="Optional details..." />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <BaseSelect v-model="status" label="Status" :options="statusOptions" />
      <BaseSelect v-model="priority" label="Priority" :options="priorityOptions" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <BaseInput v-model="dueDate" type="date" label="Due date" />
      <BaseSelect
        v-model="categoryId"
        label="Category"
        placeholder="No category"
        :options="categories.map((c) => ({ value: c.id, label: c.name }))"
      />
    </div>

    <div class="mt-2 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" :loading="loading">Save Task</BaseButton>
    </div>
  </form>
</template>
