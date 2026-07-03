<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all duration-200"
      @click.self="$emit('update:modelValue', false)"
    >
      <!-- Modal main layout panel body -->
      <div class="bg-white w-full max-w-lg p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/5 transform transition-all flex flex-col space-y-4">
        
        <!-- Modal header container layer -->
        <div class="flex items-center justify-between pb-1">
          <h3 class="text-base font-bold text-gray-900 tracking-tight">
            {{ title }}
          </h3>
          
          <button
            class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            @click="$emit('update:modelValue', false)"
            aria-label="Close modal dialog window block"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Target content input insertion point wrapper -->
        <div class="relative w-full">
          <slot />
        </div>

      </div>
    </div>
  </Teleport>
</template>
