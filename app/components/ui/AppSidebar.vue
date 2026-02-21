<template>
  <!-- Enterprise Glass Sidebar — Desktop & Tablet -->
  <aside
    class="flex flex-col h-full material-ultrathin rounded-2xl overflow-hidden"
    :class="collapsed ? 'items-center' : ''"
  >
    <!-- ── Logo / Brand ─────────────────────────────────────────────── -->
    <div
      class="flex items-center px-3 py-4 flex-shrink-0"
      :class="collapsed ? 'justify-center' : 'gap-3 px-4'"
    >
      <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-fab">
        <Icon name="lucide:zap" class="w-5 h-5 text-white" />
      </div>
      <Transition name="fade">
        <div v-if="!collapsed" class="min-w-0">
          <p class="text-headline font-bold text-slate-900 dark:text-white truncate leading-none">Enterprise</p>
          <p class="text-caption2 text-slate-500 dark:text-slate-400 truncate mt-0.5">BenHarun IT Solutions</p>
        </div>
      </Transition>
    </div>

    <!-- ── Tenant switcher ──────────────────────────────────────────── -->
    <div v-if="!collapsed" class="px-3 mb-3">
      <TenantSwitcher />
    </div>

    <div v-if="!collapsed" class="divider mx-3 mb-3" />

    <!-- ── Navigation ───────────────────────────────────────────────── -->
    <nav class="flex-1 overflow-y-auto px-2 space-y-0.5">
      <template v-for="item in navItems" :key="item.to">
        <!-- Section header -->
        <p
          v-if="item.section && !collapsed"
          class="text-caption2 font-semibold text-slate-400 dark:text-slate-500
                 uppercase tracking-wider px-3 pt-4 pb-1 first:pt-1"
        >
          {{ item.section }}
        </p>

        <NuxtLink
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative pressable"
          :class="[
            isActive(item.to)
              ? 'bg-primary-600 text-white shadow-fab'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
            collapsed ? 'justify-center' : '',
          ]"
          @click="emit('close')"
        >
          <!-- Icon -->
          <Icon
            :name="item.icon"
            class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
          />

          <!-- Label + badge (hidden when collapsed) -->
          <template v-if="!collapsed">
            <span class="flex-1 text-callout font-medium truncate">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="badge text-caption2 font-semibold rounded-full min-w-[20px] text-center px-1.5 py-0.5"
              :class="isActive(item.to) ? 'bg-white/20 text-white' : 'badge-blue'"
            >
              {{ item.badge }}
            </span>
          </template>

          <!-- Tooltip on collapsed -->
          <div
            v-if="collapsed"
            class="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700
                   text-white text-caption1 font-medium rounded-lg whitespace-nowrap
                   opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
          >
            {{ item.label }}
          </div>
        </NuxtLink>
      </template>
    </nav>

    <div class="divider mx-3 my-2" />

    <!-- ── Bottom actions ───────────────────────────────────────────── -->
    <div class="px-2 pb-3 space-y-0.5">
      <!-- Settings -->
      <NuxtLink
        to="/settings"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
               text-slate-600 dark:text-slate-300 transition-colors pressable"
        :class="collapsed ? 'justify-center' : ''"
      >
        <Icon name="lucide:settings" class="w-5 h-5" />
        <span v-if="!collapsed" class="text-callout font-medium">Settings</span>
      </NuxtLink>

      <!-- User profile -->
      <div
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
               cursor-pointer transition-colors"
        :class="collapsed ? 'justify-center' : ''"
      >
        <div class="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="w-full h-full object-cover" />
          <span v-else class="text-caption1 font-bold text-white">{{ initials }}</span>
        </div>
        <template v-if="!collapsed">
          <div class="min-w-0 flex-1">
            <p class="text-callout font-semibold text-slate-800 dark:text-white truncate">{{ displayName }}</p>
            <p class="text-caption2 text-slate-400 truncate">{{ user?.email }}</p>
          </div>
        </template>
      </div>

      <!-- Collapse toggle (desktop only) -->
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
               text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors pressable"
        :class="collapsed ? 'justify-center' : ''"
        @click="emit('toggle')"
      >
        <Icon
          :name="collapsed ? 'lucide:chevrons-right' : 'lucide:chevrons-left'"
          class="w-4 h-4"
        />
        <span v-if="!collapsed" class="text-caption1 font-medium">Collapse</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types'

const props = defineProps<{
  collapsed?: boolean
  mobile?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const route = useRoute()
const { displayName, initials, avatarUrl, user, isSuperAdmin } = useAuth()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const navItems = computed(() => {
  const items: (NavItem & { section?: string })[] = [
    // Main
    { section: 'Main', label: 'Dashboard',  icon: 'lucide:layout-dashboard', to: '/' },
    { label: 'Analytics',   icon: 'lucide:bar-chart-3',    to: '/explore' },
    { label: 'Reports',     icon: 'lucide:file-bar-chart', to: '/reports' },

    // Workspace
    { section: 'Workspace', label: 'Team',    icon: 'lucide:users',        to: '/settings/team' },
    { label: 'Integrations', icon: 'lucide:puzzle',       to: '/settings/integrations' },
    { label: 'Notifications', icon: 'lucide:bell', to: '/settings/notifications', badge: 3 },

    // Account
    { section: 'Account', label: 'Profile',  icon: 'lucide:user-circle',   to: '/profile' },
    { label: 'Billing',      icon: 'lucide:credit-card',  to: '/settings/billing' },
    { label: 'Security',     icon: 'lucide:shield-check', to: '/settings/security' },
  ]

  // Super admin section
  if (isSuperAdmin.value) {
    items.push(
      { section: 'Admin', label: 'Admin Panel', icon: 'lucide:crown', to: '/admin' },
      { label: 'Tenants',    icon: 'lucide:building-2',    to: '/admin/tenants' },
    )
  }

  return items
})
</script>
