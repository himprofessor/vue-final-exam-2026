<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    type?: string
    label?: string
    placeholder?: string
    required?: boolean
    error?: string
  }>(),
  {
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    error: '',
    modelValue: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
})

const showError = computed(() => Boolean(props.error))
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
      :class="showError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :value="value"
      @input="(e) => (value = (e.target as HTMLInputElement).value)"
    />
    <p v-if="showError" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

