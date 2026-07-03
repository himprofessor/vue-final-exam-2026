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
  <div class="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-sm mx-auto animate-fadeIn">
    
    <!-- Sophisticated layered vector icon placeholder container -->
    <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100/80 shadow-sm shadow-gray-100" aria-hidden="true">
      <svg class="h-6 w-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    
    <!-- Textual description metadata content block stack -->
    <div class="space-y-1">
      <h3 class="text-sm font-bold text-gray-900 tracking-tight">
        {{ title }}
      </h3>
      <p class="text-xs text-gray-500 leading-relaxed max-w-[260px] mx-auto">
        {{ message }}
      </p>
    </div>
    
    <!-- Context action button injection container -->
    <div v-if="$slots.action" class="mt-5 w-full flex justify-center">
      <slot name="action" />
    </div>
  </div>
</template>
