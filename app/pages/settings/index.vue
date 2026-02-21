<template>
  <div>
    <!-- Settings layout: shared sub-nav + content -->
    <div class="flex items-center gap-2 mb-6">
      <Icon name="lucide:settings" class="w-5 h-5 text-slate-400" />
      <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Settings</h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sub-navigation -->
      <aside class="w-full lg:w-52 flex-shrink-0">
        <nav class="liquid-glass rounded-2xl p-2 space-y-0.5">
          <NuxtLink
            v-for="item in settingsNav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-callout font-medium transition-all"
            :class="$route.path === item.to
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
          >
            <Icon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Account settings panel -->
      <div class="flex-1 min-w-0 space-y-5">
        <!-- Profile -->
        <LiquidGlassCard title="Profile" icon="lucide:user-circle">
          <div class="flex flex-col sm:flex-row gap-6">
            <!-- Avatar -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center overflow-hidden">
                <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="w-full h-full object-cover" />
                <span v-else class="text-title2 font-bold text-white">{{ initials }}</span>
              </div>
              <GlassButton variant="secondary" size="sm" icon-left="lucide:upload">Upload photo</GlassButton>
            </div>

            <!-- Form -->
            <div class="flex-1 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-footnote font-medium text-slate-600 dark:text-slate-300 mb-1.5">Full name</label>
                  <input v-model="form.name" type="text" class="input-field" />
                </div>
                <div>
                  <label class="block text-footnote font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email</label>
                  <input v-model="form.email" type="email" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-footnote font-medium text-slate-600 dark:text-slate-300 mb-1.5">Job title</label>
                <input v-model="form.title" type="text" placeholder="e.g. Head of Engineering" class="input-field" />
              </div>
              <GlassButton variant="primary" size="sm" :loading="saving" @click="save">Save Changes</GlassButton>
            </div>
          </div>
        </LiquidGlassCard>

        <!-- Preferences -->
        <LiquidGlassCard title="Preferences" icon="lucide:sliders">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-callout font-medium text-slate-800 dark:text-white">Dark Mode</p>
                <p class="text-caption1 text-slate-500">Follows your system preference unless overridden</p>
              </div>
              <button
                class="relative w-11 h-6 rounded-full transition-colors"
                :class="isDark ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
                @click="toggleTheme"
              >
                <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  :class="isDark ? 'translate-x-5' : ''" />
              </button>
            </div>
            <div class="divider" />
            <div class="flex items-center justify-between">
              <div>
                <p class="text-callout font-medium text-slate-800 dark:text-white">Compact Mode</p>
                <p class="text-caption1 text-slate-500">Tighter spacing for more information density</p>
              </div>
              <button
                class="relative w-11 h-6 rounded-full transition-colors"
                :class="compactMode ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
                @click="compactMode = !compactMode"
              >
                <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  :class="compactMode ? 'translate-x-5' : ''" />
              </button>
            </div>
          </div>
        </LiquidGlassCard>

        <!-- Danger zone -->
        <LiquidGlassCard title="Danger Zone" icon="lucide:triangle-alert" icon-color="red">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-xl border border-danger/20 bg-danger-light dark:bg-red-950/30">
              <div>
                <p class="text-callout font-semibold text-slate-800 dark:text-white">Delete account</p>
                <p class="text-caption1 text-slate-500">Permanently delete your account and all data</p>
              </div>
              <GlassButton variant="destructive" size="sm">Delete</GlassButton>
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Settings' })

const { user, displayName, initials, avatarUrl, updateProfile } = useAuth()
const { isDark, toggleTheme } = useAppleTheme()

const form = reactive({
  name:  user.value?.name  ?? '',
  email: user.value?.email ?? '',
  title: '',
})
const compactMode = ref(false)
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await updateProfile(form)
  } finally {
    saving.value = false
  }
}

const settingsNav = [
  { label: 'Account',       icon: 'lucide:user-circle',   to: '/settings' },
  { label: 'Billing',       icon: 'lucide:credit-card',   to: '/settings/billing' },
  { label: 'Team',          icon: 'lucide:users',         to: '/settings/team' },
  { label: 'Security',      icon: 'lucide:shield-check',  to: '/settings/security' },
  { label: 'Integrations',  icon: 'lucide:puzzle',        to: '/settings/integrations' },
  { label: 'Notifications', icon: 'lucide:bell',          to: '/settings/notifications' },
]
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)]
         bg-white dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all;
}
</style>
