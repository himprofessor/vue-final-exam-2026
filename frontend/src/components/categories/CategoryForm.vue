<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Category, CategoryPayload } from '@/types'

const props = defineProps<{
  category?: Category | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: CategoryPayload): void
  (e: 'cancel'): void
}>()

const name = ref('')
const color = ref('#6366f1')
const nameError = ref('')

// Pre-fill the form when editing an existing category.
watch(
  () => props.category,
  (category) => {
    name.value = category?.name || ''
    color.value = category?.color || '#6366f1'
  },
  { immediate: true }
)

function handleSubmit() {
  nameError.value = ''
  if (!name.value.trim()) {
    nameError.value = 'Category name is required'
    return
  }
  emit('submit', { name: name.value.trim(), color: color.value })
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <BaseInput v-model="name" label="Name" placeholder="e.g. Work" required :error="nameError" />

    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Color</label>
      <input v-model="color" type="color" class="h-10 w-16 cursor-pointer rounded border border-gray-300" />
    </div>

    <div class="mt-2 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" :loading="loading">Save</BaseButton>
    </div>
  </form>
</template>
