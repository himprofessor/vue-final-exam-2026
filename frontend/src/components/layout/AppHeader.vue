<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
    <div class="md:hidden text-lg font-semibold text-gray-900">TaskFlow</div>
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
