<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const isOpen = computed(() => props.modelValue)

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="w-full max-w-lg rounded-xl bg-white shadow-lg">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
        <button class="text-gray-500 hover:text-gray-700" @click="close">✕</button>
      </div>
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

