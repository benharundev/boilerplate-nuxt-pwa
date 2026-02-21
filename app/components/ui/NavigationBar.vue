<template>
  <!-- Navigation bar — adapts between large title (mobile) and compact (desktop) -->
  <header
    class="flex-shrink-0 material-chrome flex items-center gap-3 px-4 border-b border-[var(--color-border)]"
    :style="{ paddingTop: mobile ? 'env(safe-area-inset-top, 0px)' : undefined }"
    style="min-height: 60px"
  >
    <!-- Left slot (back button, toggle, etc.) -->
    <div class="flex items-center gap-2 min-w-0">
      <slot name="left" />
    </div>

    <!-- Center: title -->
    <div class="flex-1 min-w-0 text-center">
      <Transition name="fade" mode="out-in">
        <h1
          :key="largeTitle || pageTitle"
          class="truncate font-semibold text-slate-900 dark:text-white"
          :class="mobile ? 'text-title3' : 'text-headline'"
        >
          {{ largeTitle || pageTitle }}
        </h1>
      </Transition>
    </div>

    <!-- Right slot (search, notifications, avatar) -->
    <div class="flex items-center gap-1 justify-end">
      <!-- Theme toggle -->
      <button
        class="touch-target rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <Icon
          :name="isDark ? 'lucide:sun' : 'lucide:moon'"
          class="w-4.5 h-4.5 text-slate-500"
        />
      </button>

      <!-- Notifications -->
      <button
        class="touch-target rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
        @click="router.push('/settings/notifications')"
      >
        <Icon name="lucide:bell" class="w-4.5 h-4.5 text-slate-500" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
      </button>

      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  largeTitle?: string
  mobile?: boolean
  sidebarCollapsed?: boolean
}>()

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useAppleTheme()

const pageTitle = computed(() =>
  (route.meta.title as string) ?? 'Dashboard',
)
</script>
