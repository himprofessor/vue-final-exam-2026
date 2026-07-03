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
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :value="modelValue ?? ''"
      class="input-field"
      :class="{ 'border-red-400 focus:ring-red-400': error }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" >{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
