<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="flex items-center justify-center gap-3 py-6 text-sm text-gray-600">
    <span class="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    <span v-if="label">{{ label }}</span>
  </div>
</template>

