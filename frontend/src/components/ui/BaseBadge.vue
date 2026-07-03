<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    color?: string
  }>(),
  {
    color: '#6366f1',
  },
)
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
    :style="{ backgroundColor: `${color}22`, color }"
  >
    {{ text }}
  </span>
</template>

