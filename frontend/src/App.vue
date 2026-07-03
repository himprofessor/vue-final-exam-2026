<script setup lang="ts">
// App.vue is intentionally tiny: it only renders whatever the current
// route matches. All layout (sidebar/header) lives in AppLayout.vue,
// which is used by individual routes - see router/index.ts.

// Clear stale auth tokens if ?force-logout is in the URL.
// Visit http://localhost:5173/?force-logout to reset your session.
if (window.location.search.includes('force-logout')) {
  localStorage.removeItem('taskflow_token')
  localStorage.removeItem('taskflow_user')
  // Remove the query param so it doesn't trigger again on future navigations
  window.history.replaceState({}, '', window.location.pathname)
}
</script>

<template>
  <RouterView />
</template>
