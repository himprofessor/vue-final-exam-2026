<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
import type { Category, CategoryPayload } from '@/types'

const categoryStore = useCategoryStore()

const isModalOpen = ref(false)
const editingCategory = ref<Category | null>(null)
const isConfirmOpen = ref(false)
const categoryToDelete = ref<Category | null>(null)

onMounted(() => {
  categoryStore.fetchCategories()
})

function openCreateModal() {
  editingCategory.value = null
  isModalOpen.value = true
}

function openEditModal(category: Category) {
  editingCategory.value = category
  isModalOpen.value = true
}

async function handleSubmit(payload: CategoryPayload) {
  const success = editingCategory.value
    ? await categoryStore.updateCategory(editingCategory.value.id, payload)
    : await categoryStore.createCategory(payload)

  if (success) {
    isModalOpen.value = false
  }
}

function askDelete(category: Category) {
  categoryToDelete.value = category
  isConfirmOpen.value = true
}

async function confirmDelete() {
  if (!categoryToDelete.value) return
  const success = await categoryStore.deleteCategory(categoryToDelete.value.id)
  if (success) {
    isConfirmOpen.value = false
    categoryToDelete.value = null
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Categories</h1>
        <p class="text-sm text-gray-500">Organize your tasks into categories.</p>
      </div>
      <BaseButton @click="openCreateModal">+ New Category</BaseButton>
    </div>

    <ErrorAlert
      v-if="categoryStore.error"
      :message="categoryStore.error"
      class="mb-4"
      @dismiss="categoryStore.error = null"
    />

    <LoadingSpinner v-if="categoryStore.loading && !categoryStore.categories.length" label="Loading categories..." />

    <EmptyState
      v-else-if="!categoryStore.categories.length"
      title="No categories yet"
      message="Create your first category to start organizing tasks."
    >
      <template #action>
        <BaseButton @click="openCreateModal">+ New Category</BaseButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="category in categoryStore.categories" :key="category.id" class="card flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full shrink-0" :style="{ backgroundColor: category.color }" />
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
            
            <span 
              :class="[
                Number(category.task_count || 0) > 0 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-gray-50 text-gray-500 border-gray-200',
                'inline-flex items-center w-max px-2 py-0.5 mt-1 rounded text-xs font-medium border'
              ]"
            >
              {{ Number(category.task_count || 0) }} {{ Number(category.task_count || 0) === 1 ? 'task' : 'tasks' }}
            </span>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="text-sm font-medium text-primary-600 hover:text-primary-700" @click="openEditModal(category)">
            Edit
          </button>
          <button class="text-sm font-medium text-red-600 hover:text-red-700" @click="askDelete(category)">
            Delete
          </button>
        </div>
      </div>
    </div>

    <BaseModal v-model="isModalOpen" :title="editingCategory ? 'Edit Category' : 'New Category'">
      <CategoryForm
        :category="editingCategory"
        :loading="categoryStore.loading"
        @submit="handleSubmit"
        @cancel="isModalOpen = false"
      />
    </BaseModal>

    <ConfirmDialog
      v-model="isConfirmOpen"
      title="Delete category?"
      :message="`This will remove '${categoryToDelete?.name}'. Tasks using it will become uncategorized.`"
      :loading="categoryStore.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
