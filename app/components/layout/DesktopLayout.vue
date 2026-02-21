<template>
  <!-- Desktop: Collapsible sidebar + main content area -->
  <div class="flex h-dvh overflow-hidden bg-slate-100 dark:bg-slate-950 p-2 gap-2">

    <!-- ── Sidebar ─────────────────────────────────────────────────── -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      class="flex-shrink-0 transition-all duration-350 ease-apple"
      :class="sidebarCollapsed ? 'w-16' : 'w-64'"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />

    <!-- ── Main area ────────────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card">

      <!-- Top nav bar -->
      <NavigationBar :sidebar-collapsed="sidebarCollapsed">
        <template #left>
          <button
            class="touch-target rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <Icon
              :name="sidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
              class="w-5 h-5 text-slate-500"
            />
          </button>
        </template>
      </NavigationBar>

      <!-- Page content — scrollable -->
      <main class="flex-1 overflow-y-auto scroll-content-area">
        <!-- Two-column on wide screens, single on lg -->
        <div class="container-enterprise py-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarCollapsed = ref(false)
const { isUltraWide } = useDeviceType()

// Auto-collapse on medium desktop, expand on ultrawide
watchEffect(() => {
  sidebarCollapsed.value = !isUltraWide.value
})
</script>
