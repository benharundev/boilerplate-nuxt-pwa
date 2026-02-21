<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <Icon name="lucide:bell" class="w-5 h-5 text-slate-400" />
      <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Notifications</h1>
    </div>

    <div class="space-y-5">
      <!-- Delivery channels -->
      <LiquidGlassCard title="Delivery Channels" icon="lucide:send" icon-color="blue">
        <div class="space-y-4">
          <div v-for="channel in channels" :key="channel.key" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="icon-well" :class="`icon-well-${channel.color}`">
                <Icon :name="channel.icon" class="w-4 h-4" />
              </div>
              <div>
                <p class="text-callout font-medium text-slate-800 dark:text-white">{{ channel.label }}</p>
                <p class="text-caption2 text-slate-400">{{ channel.desc }}</p>
              </div>
            </div>
            <button
              class="relative w-11 h-6 rounded-full transition-colors"
              :class="channel.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
              @click="channel.enabled = !channel.enabled"
            >
              <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                :class="channel.enabled ? 'translate-x-5' : ''" />
            </button>
          </div>
        </div>
      </LiquidGlassCard>

      <!-- Digest frequency -->
      <LiquidGlassCard title="Email Digest" icon="lucide:mail" icon-color="purple">
        <p class="text-caption1 text-slate-500 mb-4">Receive a summary email of activity in your workspace.</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="freq in ['Realtime', 'Daily', 'Weekly', 'Never']"
            :key="freq"
            class="px-3 py-2 rounded-xl text-callout font-medium border transition-all"
            :class="digestFreq === freq
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-[var(--color-border)] text-slate-600 dark:text-slate-300 hover:border-primary-300'"
            @click="digestFreq = freq"
          >
            {{ freq }}
          </button>
        </div>
      </LiquidGlassCard>

      <!-- Notification categories -->
      <LiquidGlassCard title="Notification Types" icon="lucide:sliders-horizontal" icon-color="green">
        <div class="space-y-0 divide-y divide-[var(--color-border)]">
          <div v-for="cat in notifCategories" :key="cat.key" class="py-3 grid grid-cols-4 gap-4 items-center">
            <div class="col-span-2">
              <p class="text-callout font-medium text-slate-700 dark:text-slate-200">{{ cat.label }}</p>
              <p class="text-caption2 text-slate-400">{{ cat.desc }}</p>
            </div>
            <!-- Three toggles: In-app, Email, Push -->
            <div v-for="ch in ['inApp', 'email', 'push'] as const" :key="ch" class="flex flex-col items-center gap-1">
              <p class="text-caption2 text-slate-400 capitalize">{{ ch === 'inApp' ? 'In-app' : ch }}</p>
              <button
                class="relative w-9 h-5 rounded-full transition-colors"
                :class="cat[ch] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
                @click="cat[ch] = !cat[ch]"
              >
                <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                  :class="cat[ch] ? 'translate-x-4' : ''" />
              </button>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      <!-- Do Not Disturb -->
      <LiquidGlassCard title="Do Not Disturb" icon="lucide:moon" icon-color="amber">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-callout font-medium text-slate-800 dark:text-white">Quiet Hours</p>
            <p class="text-caption1 text-slate-500">Silence all push notifications during these hours</p>
          </div>
          <button
            class="relative w-11 h-6 rounded-full transition-colors"
            :class="quietHours ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
            @click="quietHours = !quietHours"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
              :class="quietHours ? 'translate-x-5' : ''" />
          </button>
        </div>
        <Transition name="fade">
          <div v-if="quietHours" class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-caption1 text-slate-500 mb-1">From</label>
              <input type="time" v-model="quietFrom" class="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-caption1 text-slate-500 mb-1">Until</label>
              <input type="time" v-model="quietTo" class="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </Transition>
      </LiquidGlassCard>
    </div>

    <!-- Save -->
    <div class="mt-6 flex justify-end">
      <GlassButton variant="primary" size="md" icon-left="lucide:save" :loading="saving" @click="save">
        Save Preferences
      </GlassButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Notifications' })

const saving     = ref(false)
const digestFreq = ref('Daily')
const quietHours = ref(false)
const quietFrom  = ref('22:00')
const quietTo    = ref('08:00')

const channels = reactive([
  { key: 'inApp', label: 'In-App',       icon: 'lucide:bell',         color: 'blue',   desc: 'Notifications inside the dashboard', enabled: true },
  { key: 'email', label: 'Email',        icon: 'lucide:mail',         color: 'purple', desc: 'Sent to your registered email',       enabled: true },
  { key: 'push',  label: 'Push',         icon: 'lucide:smartphone',   color: 'green',  desc: 'Browser and mobile push notifications', enabled: false },
  { key: 'slack', label: 'Slack',        icon: 'lucide:hash',         color: 'amber',  desc: 'Post to a Slack channel (requires integration)', enabled: false },
])

const notifCategories = reactive([
  { key: 'billing',  label: 'Billing',        desc: 'Invoices, failed payments',       inApp: true,  email: true,  push: true  },
  { key: 'security', label: 'Security',       desc: 'Logins, policy changes',          inApp: true,  email: true,  push: true  },
  { key: 'team',     label: 'Team',           desc: 'Member join, role changes',       inApp: true,  email: true,  push: false },
  { key: 'product',  label: 'Product Updates', desc: 'New features, changelog',        inApp: true,  email: false, push: false },
  { key: 'marketing', label: 'Marketing',     desc: 'Tips, newsletters, promotions',   inApp: false, email: false, push: false },
])

async function save() {
  saving.value = true
  await new Promise(r => setTimeout(r, 600))
  saving.value = false
}
</script>
