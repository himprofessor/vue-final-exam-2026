<script setup lang="ts">
import { computed } from 'vue'

type Option = { value: string | number; label: string }

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    options: Option[]
  }>(),
  {
    label: '',
    placeholder: 'Select...',
    modelValue: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => String(props.modelValue ?? ''),
  set: (v: string) => emit('update:modelValue', v),
})
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
      :value="value"
      @change="(e) => (value = (e.target as HTMLSelectElement).value)"
    >
      <option value="" disabled hidden>
        {{ placeholder }}
      </option>
      <option v-for="o in options" :key="String(o.value)" :value="o.value">
        {{ o.label }}
      </option>
    </select>
  </div>
</template>

