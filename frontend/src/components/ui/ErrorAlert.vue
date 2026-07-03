<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <div class="flex items-start justify-between gap-3.5 rounded-xl border border-red-200/80 bg-red-50/60 p-4 text-sm text-red-800 backdrop-blur-xs animate-fadeIn">
    <!-- Main text message content arrangement layer -->
    <div class="flex items-start gap-2.5">
      <!-- High-visibility diagnostic attention warning icon layout -->
      <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span class="font-medium leading-normal text-red-800/90 break-words">
        {{ message }}
      </span>
    </div>
    
    <!-- Action dismiss handle closure button -->
    <button 
      class="rounded-lg p-0.5 text-red-400 hover:bg-red-100/60 hover:text-red-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400/30 shrink-0" 
      @click="$emit('dismiss')"
      aria-label="Dismiss error notice block"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
