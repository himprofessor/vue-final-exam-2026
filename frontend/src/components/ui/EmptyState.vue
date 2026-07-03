<script setup lang="ts">
const props = defineProps<{
  title: string
  message?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center">
    <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
    <p v-if="message" class="mt-2 text-sm text-gray-500">{{ message }}</p>
    <div class="mt-5">
      <slot name="action" />
    </div>
  </div>
</template>

