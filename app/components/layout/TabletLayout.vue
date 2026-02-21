<template>
  <!-- Tablet: Master-Detail split on landscape; bottom nav on portrait -->
  <div class="flex h-dvh overflow-hidden bg-slate-100 dark:bg-slate-950">

    <!-- ── LANDSCAPE: sidebar + detail ────────────────────────────── -->
    <template v-if="isTabletLandscape">
      <!-- Sidebar (icon-only or full 280px) -->
      <AppSidebar
        :collapsed="sidebarCollapsed"
        class="flex-shrink-0 transition-all duration-350 ease-apple"
        :class="sidebarCollapsed ? 'w-16' : 'w-72'"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Detail panel -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <NavigationBar>
          <template #left>
            <button
              class="touch-target rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              @click="sidebarCollapsed = !sidebarCollapsed"
            >
              <Icon
                :name="sidebarCollapsed ? 'lucide:sidebar-open' : 'lucide:sidebar-close'"
                class="w-5 h-5 text-slate-500"
              />
            </button>
          </template>
        </NavigationBar>

        <main class="flex-1 overflow-y-auto scroll-content-area px-5 py-5">
          <slot />
        </main>
      </div>
    </template>

    <!-- ── PORTRAIT: full-width + overlay sidebar + bottom tab ───── -->
    <template v-else>
      <!-- Overlay sidebar backdrop -->
      <Transition name="fade">
        <div
          v-if="showMobileSidebar"
          class="backdrop-overlay"
          @click="showMobileSidebar = false"
        />
      </Transition>

      <!-- Slide-over sidebar -->
      <Transition name="sidebar">
        <AppSidebar
          v-if="showMobileSidebar"
          :collapsed="false"
          class="fixed inset-y-0 left-0 z-overlay w-72 rounded-r-3xl shadow-glass-lg"
          mobile
          @close="showMobileSidebar = false"
        />
      </Transition>

      <!-- Full-width content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <NavigationBar>
          <template #left>
            <button
              class="touch-target rounded-xl"
              @click="showMobileSidebar = true"
            >
              <Icon name="lucide:menu" class="w-5 h-5 text-slate-500" />
            </button>
          </template>
        </NavigationBar>

        <!-- Scrollable content; pb for bottom tab bar -->
        <main class="flex-1 overflow-y-auto scroll-content-area px-4 pb-[83px]">
          <slot />
        </main>

        <!-- Persistent bottom tab bar -->
        <BottomTabBar />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { isTabletLandscape } = useDeviceType()
const sidebarCollapsed = ref(true)     // icon-only on tablet landscape
const showMobileSidebar = ref(false)

// Close overlay sidebar on orientation change
watch(isTabletLandscape, () => {
  showMobileSidebar.value = false
})
</script>
