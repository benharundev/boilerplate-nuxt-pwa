<template>
  <div>
    <!-- Profile hero -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 16 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      class="liquid-glass rounded-2xl p-6 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-5"
    >
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <div class="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-glass">
          <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="w-full h-full object-cover" />
          <span v-else class="text-title2 font-extrabold text-white">{{ initials }}</span>
        </div>
        <div class="absolute bottom-0 right-0 w-5 h-5 bg-success rounded-full border-2 border-white dark:border-slate-800" />
      </div>

      <!-- Info -->
      <div class="flex-1 text-center sm:text-left">
        <h1 class="text-title2 font-bold text-slate-900 dark:text-white tracking-tight">{{ displayName }}</h1>
        <p class="text-callout text-slate-500 mb-3">{{ user?.email }}</p>

        <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
          <span class="badge badge-blue">{{ user?.role?.replace('_', ' ') }}</span>
          <span class="badge badge-green">Active</span>
          <PlanBadge :plan="tenant?.plan ?? 'free'" size="sm" :show-icon="true" />
        </div>
      </div>

      <GlassButton variant="secondary" icon-left="lucide:pencil" size="sm" @click="$router.push('/settings')">
        Edit Profile
      </GlassButton>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4 mb-5">
      <div
        v-for="(stat, i) in profileStats"
        :key="stat.label"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 300, delay: i * 80 } }"
        class="liquid-glass rounded-2xl p-4 text-center"
      >
        <p class="text-title3 font-extrabold text-slate-900 dark:text-white tabular-nums">{{ stat.value }}</p>
        <p class="text-caption1 text-slate-500 mt-0.5">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Notification prefs + activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Notification preferences -->
      <LiquidGlassCard title="Notifications" icon="lucide:bell" icon-color="amber">
        <div class="space-y-3">
          <div v-for="pref in notifPrefs" :key="pref.key" class="flex items-center justify-between py-1">
            <div>
              <p class="text-callout font-medium text-slate-700 dark:text-slate-200">{{ pref.label }}</p>
              <p class="text-caption2 text-slate-400">{{ pref.desc }}</p>
            </div>
            <button
              class="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              :class="pref.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
              @click="pref.enabled = !pref.enabled"
            >
              <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                :class="pref.enabled ? 'translate-x-5' : ''" />
            </button>
          </div>
        </div>
      </LiquidGlassCard>

      <!-- Activity log -->
      <LiquidGlassCard title="Recent Activity" icon="lucide:activity" icon-color="blue">
        <div class="space-y-0">
          <div
            v-for="(event, i) in activityLog"
            :key="i"
            class="flex items-start gap-3 py-3"
            :class="i < activityLog.length - 1 ? 'border-b border-[var(--color-border)]' : ''"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="event.iconBg">
              <Icon :name="event.icon" class="w-4 h-4" :class="event.iconColor" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-callout text-slate-700 dark:text-slate-200">{{ event.text }}</p>
              <p class="text-caption2 text-slate-400">{{ event.time }}</p>
            </div>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Profile' })

const { user, displayName, initials, avatarUrl } = useAuth()
const { tenant } = useTenant()

const profileStats = [
  { value: '428',  label: 'Days Active' },
  { value: '3',    label: 'Workspaces' },
  { value: '14',   label: 'Team Invites' },
]

const notifPrefs = reactive([
  { key: 'billing',  label: 'Billing Alerts',    desc: 'Invoices, failed payments',       enabled: true },
  { key: 'security', label: 'Security Events',   desc: 'New logins, password changes',    enabled: true },
  { key: 'team',     label: 'Team Activity',     desc: 'New members, role changes',       enabled: true },
  { key: 'updates',  label: 'Product Updates',   desc: 'New features and improvements',   enabled: false },
  { key: 'marketing', label: 'Marketing',        desc: 'Tips, newsletter, promotions',    enabled: false },
])

const activityLog = [
  { icon: 'lucide:log-in',     iconBg: 'bg-primary-50 dark:bg-primary-950', iconColor: 'text-primary-600',  text: 'Signed in from MacBook Pro',       time: '2 hours ago' },
  { icon: 'lucide:settings',   iconBg: 'bg-slate-50 dark:bg-slate-800',    iconColor: 'text-slate-500',    text: 'Updated profile settings',          time: 'Yesterday' },
  { icon: 'lucide:user-plus',  iconBg: 'bg-success/10',                    iconColor: 'text-success',      text: 'Invited Siti to Acme workspace',    time: '3 days ago' },
  { icon: 'lucide:credit-card', iconBg: 'bg-green-50 dark:bg-green-950',  iconColor: 'text-green-600',    text: 'Upgraded workspace to Pro plan',    time: 'Jan 20, 2026' },
  { icon: 'lucide:key',        iconBg: 'bg-amber-50 dark:bg-amber-950',   iconColor: 'text-warning',      text: 'Created new API key (Production)',  time: 'Jan 15, 2026' },
]
</script>
