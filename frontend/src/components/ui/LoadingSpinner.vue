<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Loading...' })
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fadeIn">
    <!-- Sophisticated spinning vector wheel with dual-color depth -->
    <div class="relative flex items-center justify-center">
      <svg class="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
        <!-- Background track matching form input accent colors -->
        <circle class="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3.5" />
        <!-- Foreground sweeping indicator segment -->
        <path class="opacity-85" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
    
    <!-- Micro-text context processing label feedback -->
    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">
      {{ label }}
    </p>
  </div>
</template>
