<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

// Pre-filled variables matching your database baseline
const email = ref('jane@taskflow.com')
const password = ref('password123')

const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  authStore.error = null
  
  // FIX: Passed inputs as direct separate arguments to perfectly match your auth store's signature: login(email, password)
  const success = await authStore.login(email.value, password.value)
  
  if (success) {
    // Navigate straight to your operational task list path name
    router.push({ name: 'tasks' })
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="card w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
          T
        </div>
        <h1 class="text-xl font-semibold text-gray-900">Welcome back</h1>
        <p class="text-sm text-gray-500">Log in to TaskFlow</p>
      </div>

      <ErrorAlert v-if="authStore.error" :message="authStore.error" class="mb-4" @dismiss="authStore.error = null" />

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" required />
        <BaseInput v-model="password" type="password" label="Password" placeholder="••••••••" required />
        <BaseButton type="submit" class="w-full" :loading="authStore.loading">Log In</BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        Don't have an account?
        <RouterLink :to="{ name: 'register' }" class="font-medium text-primary-600 hover:text-primary-700">
          Sign up
        </RouterLink>
      </p>

      <p class="mt-4 rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-400">
        Demo account pre-filled: jane@taskflow.com / password123
      </p>
    </div>
  </div>
</template>
