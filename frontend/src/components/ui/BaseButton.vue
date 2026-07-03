<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    loading: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
    :class="
      props.variant === 'secondary'
        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        : 'bg-primary-600 text-white hover:bg-primary-700'
    "
    :disabled="isDisabled"
    @click="(e) => emit('click', e)"
  >
    <span v-if="loading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
    <slot />
  </button>
</template>

