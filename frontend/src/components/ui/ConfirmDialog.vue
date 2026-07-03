<script setup lang="ts">
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message: string
    loading?: boolean
  }>(),
  { title: 'Are you sure?', loading: false }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all duration-200"
      @click.self="!loading && $emit('update:modelValue', false)"
    >
      <!-- Dialog main layout modal box container -->
      <div class="bg-white w-full max-w-sm p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/5 transform transition-all flex flex-col items-center text-center space-y-4">
        
        <!-- Subtle warning alert graphic accent indicator container layer -->
        <div class="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 shrink-0 mb-1" aria-hidden="true">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- Typography textual descriptive structure layout section layer -->
        <div class="space-y-1.5 w-full">
          <h3 class="text-base font-bold text-gray-900 tracking-tight">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-500 leading-relaxed px-2">
            {{ message }}
          </p>
        </div>

        <!-- Action options controls baseline layout wrappers -->
        <div class="flex items-center justify-center gap-3 pt-2 w-full">
          <BaseButton 
            variant="secondary" 
            :disabled="loading" 
            class="w-full"
            @click="$emit('update:modelValue', false)"
          >
            Cancel
          </BaseButton>
          <BaseButton 
            variant="danger" 
            :loading="loading" 
            class="w-full"
            @click="$emit('confirm')"
          >
            Delete
          </BaseButton>
        </div>

      </div>
    </div>
  </Teleport>
</template>
