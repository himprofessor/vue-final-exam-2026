<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

defineProps<{
  modelValue: string | number | null
  options: Option[]
  label?: string
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
    <!-- Clean uppercase metadata label style consistent with BaseInput -->
    <label v-if="label" class="block text-xs font-semibold uppercase tracking-wider text-gray-600">
      {{ label }}
      <span v-if="required" class="text-red-500 font-bold ml-0.5" aria-hidden="true">*</span>
    </label>
    
    <div class="relative rounded-lg shadow-sm w-full group">
      <select
        :value="modelValue ?? ''"
        class="block w-full appearance-none rounded-lg border px-3 py-2 pr-10 text-sm text-gray-900 transition-all duration-150 outline-none bg-white cursor-pointer focus:ring-2 focus:bg-transparent"
        :class="[
          error 
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled hidden>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <!-- Clean custom interactive chevron dropdown indicator arrow icon layout -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-gray-500 transition-colors">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Error handling container block validation placement text hooks -->
    <p v-if="error" class="text-xs text-red-600 font-medium transition-all duration-150">
      {{ error }}
    </p>
  </div>
</template>
