<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
    text: string
  }>(),
  { color: '#6366f1' }
)
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :style="{ backgroundColor: color + '20', color: color }"
  >
    {{ text }}
  </span>
</template>
