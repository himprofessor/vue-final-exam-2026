<script setup lang="ts">
import { RouterLink } from 'vue-router'

const links = [
  { name: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { name: 'tasks', label: 'Tasks', to: '/tasks' },
  { name: 'categories', label: 'Categories', to: '/categories' },
]
</script>

<template>
  <aside class="hidden w-60 flex-shrink-0 border-r border-gray-200 bg-white md:block">
    <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
        T
      </div>
      <span class="text-lg font-semibold text-gray-900">TaskFlow</span>
    </div>
    <nav class="flex flex-col gap-1 p-4">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="link.to"
        class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        active-class="bg-primary-50 text-primary-700"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
