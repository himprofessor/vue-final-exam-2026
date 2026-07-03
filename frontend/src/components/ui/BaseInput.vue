<script setup lang="ts">
defineProps<{
  modelValue: string | number | null
  label?: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="space-y-1.5 w-full">
    <!-- Clean, semantic label arrangement with optional required asterisk indicator -->
    <label v-if="label" class="block text-xs font-semibold uppercase tracking-wider text-gray-600">
      {{ label }}
      <span v-if="required" class="text-red-500 font-bold ml-0.5" aria-hidden="true">*</span>
    </label>
    
    <div class="relative rounded-lg shadow-sm">
      <input
        :type="type || 'text'"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        class="block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-all duration-150 outline-none placeholder:text-gray-400 bg-white focus:ring-2 focus:bg-transparent"
        :class="[
          error 
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    
    <!-- Dynamic helper message container with an opacity transition injection -->
    <p 
      v-if="error" 
      class="text-xs text-red-600 font-medium transition-all duration-150 animate-fadeIn"
    >
      {{ error }}
    </p>
  </div>
</template>
