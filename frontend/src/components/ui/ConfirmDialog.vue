<script setup lang="ts">
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message: string
    loading?: boolean
  }>(),
  { title: 'Are you sure?', loading: false }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="card w-full max-w-sm p-6">
        <h3 class="mb-2 text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="mb-6 text-sm text-gray-600">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" :disabled="loading" @click="$emit('update:modelValue', false)">
            Cancel
          </BaseButton>
          <BaseButton variant="danger" :loading="loading" @click="$emit('confirm')">
            Delete
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
