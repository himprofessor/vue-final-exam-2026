<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    loading: false,
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium tracking-wide shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 space-x-2"
    :class="{
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-100': variant === 'primary',
      'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-400': variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-100': variant === 'danger',
    }"
  >
    <!-- Modernized loading ring spinner -->
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin shrink-0"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    
    <!-- Button template content slot wrapper -->
    <span class="truncate">
      <slot />
    </span>
  </button>
</template>
