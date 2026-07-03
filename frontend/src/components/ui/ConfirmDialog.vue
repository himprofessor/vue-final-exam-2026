<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const isOpen = computed(() => props.modelValue)

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="w-full max-w-md rounded-xl bg-white shadow-lg">
      <div class="border-b px-4 py-3">
        <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
      </div>
      <div class="px-4 py-4">
        <p class="text-sm text-gray-600">{{ message }}</p>
        <div class="mt-5 flex justify-end gap-2">
          <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="close" :disabled="loading">
            Cancel
          </button>
          <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60" @click="emit('confirm')" :disabled="loading">
            <span v-if="loading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

