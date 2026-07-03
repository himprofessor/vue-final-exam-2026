<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Nothing here yet',
    message: 'Get started by creating your first item.',
  }
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <div class="mb-2 rounded-full bg-gray-100 p-4">
      <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
    <p class="max-w-xs text-sm text-gray-500">{{ message }}</p>
    <div class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
