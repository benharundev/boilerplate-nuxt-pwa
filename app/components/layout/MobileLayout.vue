<template>
  <!-- Mobile: iOS-style layout with large title nav + bottom tab bar -->
  <div class="flex flex-col h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950">

    <!-- ── Large Title Navigation Bar ──────────────────────────────── -->
    <NavigationBar mobile :large-title="pageTitle">
      <template #right>
        <!-- Profile avatar -->
        <button class="touch-target rounded-full" @click="showProfile = true">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center overflow-hidden">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-caption1 font-bold text-white">{{ initials }}</span>
          </div>
        </button>
      </template>
    </NavigationBar>

    <!-- ── Scrollable content (with bottom tab safe area) ────────────── -->
    <main
      ref="mainEl"
      class="flex-1 overflow-y-auto scroll-content-area
             px-4 pb-safe"
      style="padding-bottom: calc(env(safe-area-inset-bottom) + 83px)"
    >
      <!-- Pull-to-refresh indicator -->
      <div
        v-if="isRefreshing"
        class="flex items-center justify-center py-4"
      >
        <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Page transition -->
      <Transition name="tab" mode="out-in">
        <slot />
      </Transition>
    </main>

    <!-- ── Bottom Tab Bar ────────────────────────────────────────────── -->
    <BottomTabBar />

    <!-- ── Profile drawer (bottom sheet style) ──────────────────────── -->
    <Transition name="sheet">
      <div
        v-if="showProfile"
        class="fixed inset-0 z-modal"
        @click.self="showProfile = false"
      >
        <div class="absolute bottom-0 left-0 right-0 material-chrome rounded-t-3xl shadow-glass-lg
                    pb-safe pb-6 pt-6 px-6"
             style="padding-bottom: calc(env(safe-area-inset-bottom) + 1.5rem)"
        >
          <!-- Handle -->
          <div class="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-5" />

          <!-- User info -->
          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center overflow-hidden">
              <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="w-full h-full object-cover" />
              <span v-else class="text-headline font-bold text-white">{{ initials }}</span>
            </div>
            <div>
              <p class="text-headline font-semibold text-slate-900 dark:text-white">{{ displayName }}</p>
              <p class="text-footnote text-slate-500">{{ user?.email }}</p>
            </div>
          </div>

          <div class="space-y-1">
            <NuxtLink
              to="/profile"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                     text-callout text-slate-700 dark:text-slate-200 transition-colors"
              @click="showProfile = false"
            >
              <Icon name="lucide:user-circle" class="w-5 h-5" />
              My Profile
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                     text-callout text-slate-700 dark:text-slate-200 transition-colors"
              @click="showProfile = false"
            >
              <Icon name="lucide:settings" class="w-5 h-5" />
              Settings
            </NuxtLink>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-light
                     text-callout text-danger transition-colors"
              @click="logout"
            >
              <Icon name="lucide:log-out" class="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { displayName, initials, avatarUrl, user, logout } = useAuth()

const showProfile = ref(false)
const isRefreshing = ref(false)
const mainEl = ref<HTMLElement | null>(null)

// Derive page title from route meta or default
const pageTitle = computed(() =>
  (route.meta.title as string) ?? 'Dashboard',
)
</script>
