<script setup lang="ts">
import { RouterLink } from 'vue-router'

const links = [
  { name: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'  },
  { name: 'tasks', label: 'Tasks', to: '/tasks',  icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'  },
  { name: 'categories', label: 'Categories', to: '/categories',     icon: 'M2.25 6.75c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125v1.5h1.5a3.375 3.375 0 013.375 3.375v1.5h1.5a3.375 3.375 0 013.375 3.375v1.5c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 20.25V6.75z' },
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
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        active-class="bg-primary-50 text-primary-700"
      >
        <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
        </svg>
        {{ link.label }}
      </RouterLink>
    </nav>
  </aside>
<!-- Mobile Bottom Navigation -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-gray-200 bg-white px-2 pb-safe md:hidden">
    <RouterLink
      v-for="link in links"
      :key="link.name"
      :to="link.to"
      class="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium text-gray-600"
      active-class="text-primary-600"
    >
      <!-- Mobile SVG Icon -->
      <svg class="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
      </svg>
      {{ link.label }}
    </RouterLink>
  </nav>
</template>