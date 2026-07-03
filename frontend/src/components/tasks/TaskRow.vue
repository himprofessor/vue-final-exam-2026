<script setup lang="ts">
// Demonstrates parent <-> child component communication:
// props flow down (task), events flow up (edit/delete/status-change).
import BaseBadge from '@/components/ui/BaseBadge.vue'
import type { Task, TaskStatus } from '@/types'

defineProps<{ task: Task }>()

const emit = defineEmits<{
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
  (e: 'status-change', id: number, status: TaskStatus): void
}>()

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
</script>

<template>
  <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
    <td class="px-4 py-3">
      <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
      <p v-if="task.description" class="line-clamp-1 text-xs text-gray-500">{{ task.description }}</p>
    </td>
    <td class="px-4 py-3">
      <BaseBadge v-if="task.category_name" :text="task.category_name" :color="task.category_color || '#6366f1'" />
      <span v-else class="text-xs text-gray-400">No category</span>
    </td>
    <td class="px-4 py-3">
      <BaseBadge :text="task.priority" :color="priorityColor[task.priority]" />
    </td>
    <td class="px-4 py-3">
      <select
        class="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
        :value="task.status"
        @change="emit('status-change', task.id, ($event.target as HTMLSelectElement).value as TaskStatus)"
      >
        <option v-for="(label, value) in statusLabel" :key="value" :value="value">{{ label }}</option>
      </select>
    </td>
    <td class="px-4 py-3 text-sm text-gray-500">{{ task.due_date || '—' }}</td>
    <td class="px-4 py-3">
      <div class="flex justify-end gap-2">
        <button class="text-sm font-medium text-primary-600 hover:text-primary-700" @click="emit('edit', task)">
          Edit
        </button>
        <button class="text-sm font-medium text-red-600 hover:text-red-700" @click="emit('delete', task)">
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>
