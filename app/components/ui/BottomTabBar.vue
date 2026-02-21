<template>
  <!-- Chrome material bottom tab bar — fixed, safe area aware -->
  <nav
    class="fixed-bottom-safe material-chrome shadow-bottom-bar
           flex items-end justify-around select-none"
    style="padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <button
      v-for="tab in tabs"
      :key="tab.to"
      class="flex flex-col items-center justify-center gap-1
             min-w-[44px] min-h-[44px] flex-1 pt-2 pb-1
             relative pressable"
      @click="navigate(tab)"
    >
      <!-- Active pill background -->
      <div
        v-if="isActive(tab.to)"
        class="absolute inset-x-2 top-1.5 h-8 rounded-full bg-primary-600/10 dark:bg-primary-400/15"
      />

      <!-- Icon -->
      <Icon
        :name="tab.icon"
        class="w-6 h-6 transition-all duration-200 ease-spring relative z-10"
        :class="[
          isActive(tab.to)
            ? 'text-primary-600 dark:text-primary-400 scale-110'
            : 'text-slate-500 dark:text-slate-400',
        ]"
      />

      <!-- Label -->
      <span
        class="text-caption2 font-medium transition-colors relative z-10"
        :class="[
          isActive(tab.to)
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-400 dark:text-slate-500',
        ]"
      >
        {{ tab.label }}
      </span>

      <!-- Badge -->
      <div
        v-if="tab.badge"
        class="absolute top-1 right-1/4 w-4 h-4 bg-danger text-white
               text-[10px] font-bold rounded-full flex items-center justify-center"
      >
        {{ tab.badge > 9 ? '9+' : tab.badge }}
      </div>
    </button>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const haptics = useHaptics()

const tabs = [
  { label: 'Home',     icon: 'lucide:layout-dashboard', to: '/' },
  { label: 'Analytics', icon: 'lucide:bar-chart-3',     to: '/explore' },
  { label: 'Team',     icon: 'lucide:users',            to: '/settings/team' },
  { label: 'Alerts',   icon: 'lucide:bell',             to: '/settings/notifications', badge: 3 },
  { label: 'Profile',  icon: 'lucide:user-circle',      to: '/profile' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

async function navigate(tab: (typeof tabs)[number]) {
  haptics.selection()
  await router.push(tab.to)
}
</script>
