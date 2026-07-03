<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const isMenuOpen = ref(false)

const links = [
  { name: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { name: 'tasks', label: 'Tasks', to: '/tasks' },
  { name: 'categories', label: 'Categories', to: '/categories' },
]
</script>

<template>
  <div>
   
    <header class="mobile-header">
      <button class="hamburger-menu-btn" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle Menu">
    
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="menu-icon-svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
     
    </header>
    <div v-if="isMenuOpen" class="dimmed-overlay" @click="isMenuOpen = false"></div>
    <aside :class="['sidebar-panel', { 'sidebar-open': isMenuOpen }]">
      <div class="sidebar-header-wrapper">
        <div class="app-logo-badge">
          T
        </div>
        <span class="app-brand-title">TaskFlow</span>
        <button class="mobile-close-drawer-btn" @click="isMenuOpen = false">×</button>
      </div>
      
      <nav class="sidebar-nav-container">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          class="sidebar-nav-link"
          active-class="sidebar-active-link"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.mobile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 4rem;
  padding: 0 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  /* background: #000; */
  padding: 0px;
  
}

.hamburger-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #374151;
}

.menu-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-brand-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}
.sidebar-panel {
  position: fixed;
  top: 0;
  left: -240px; 
  width: 240px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  z-index: 50;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
}
.sidebar-panel.sidebar-open {
  left: 0;
  /* background: #000; */
  height: 800px;
}

.sidebar-header-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 4rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.app-logo-badge {
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #4f46e5; 
  color: #ffffff;
  font-weight: 700;
}

.app-brand-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.mobile-close-drawer-btn {
  position: absolute;
  right: 1rem;
  font-size: 1.75rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
}

.sidebar-nav-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
}

.sidebar-nav-link {
  display: block;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563; 
  text-decoration: none;
  transition: background-color 0.15s ease;
}


.sidebar-nav-link:hover {
  background-color: #f3f4f6; 
}


.sidebar-active-link {
  background-color: #eef2ff; 
  color: #4338ca;
}
.dimmed-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 40;
}
@media (min-width: 768px) {
  .mobile-header,
  .mobile-close-drawer-btn,
  .dimmed-overlay {
    display: none !important;
    background: #000;
  }
  .sidebar-panel {
    position: static;
    left: 0;
    width: 15rem; 
    height: auto;
    min-height: 100vh;
    flex-shrink: 0;
  }
}
  </style> 


