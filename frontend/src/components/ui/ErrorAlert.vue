<script setup lang="ts">
const props = defineProps<{
  message: string
  class?: string
}>()

const emit = defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <div
    :class="[
      'flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm',
      props.class,
    ]"
    role="alert"
  >
    <div>
      <p class="font-medium text-red-800">Error</p>
      <p class="text-red-700">{{ message }}</p>
    </div>
    <button class="text-red-700 hover:text-red-900" @click="emit('dismiss')">✕</button>
  </div>
</template>

