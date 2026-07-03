<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const name = ref('')
const email = ref('')
const password = ref('')

const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  const success = await authStore.register(name.value, email.value, password.value)
  if (success) {
    router.push({ name: 'dashboard' })
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
        <h1 class="text-xl font-semibold text-gray-900">Create your account</h1>
        <p class="text-sm text-gray-500">Start organizing your tasks</p>
      </div>

      <ErrorAlert v-if="authStore.error" :message="authStore.error" class="mb-4" @dismiss="authStore.error = null" />

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <BaseInput v-model="name" label="Name" placeholder="Jane Doe" required />
        <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" required />
        <BaseInput v-model="password" type="password" label="Password" placeholder="At least 6 characters" required />
        <BaseButton type="submit" class="w-full" :loading="authStore.loading">Sign Up</BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        Already have an account?
        <RouterLink :to="{ name: 'login' }" class="font-medium text-primary-600 hover:text-primary-700">
          Log in
        </RouterLink>
      </p>
    </div>
  </div>
</template>
