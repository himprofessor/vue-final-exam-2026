<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// import TaskSearch from '@/components/tasks/TaskSearch.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
    <div class="md:hidden text-lg font-semibold text-gray-900">TaskFlow</div>
    
    <!-- Search bar - only show on tasks page -->
    <!-- <div v-if="route.name === 'tasks'" class="flex-1 mx-4 max-w-xs">
      <TaskSearch />
    </div> -->
    
    <div class="hidden md:block" />
    
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
      <button
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </header>
</template>
