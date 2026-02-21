<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <Icon name="lucide:shield-check" class="w-5 h-5 text-slate-400" />
      <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Security</h1>
    </div>

    <div class="space-y-5">
      <!-- 2FA -->
      <LiquidGlassCard title="Two-Factor Authentication" icon="lucide:shield" icon-color="green">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <p class="text-callout text-slate-600 dark:text-slate-300 mb-1">
              Add an extra layer of security to your account.
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span class="badge badge-red text-caption2">Disabled</span>
              <span class="text-caption1 text-slate-400">Recommended for all accounts</span>
            </div>
          </div>
          <GlassButton variant="primary" icon-left="lucide:shield-plus">Enable 2FA</GlassButton>
        </div>
      </LiquidGlassCard>

      <!-- API Keys -->
      <LiquidGlassCard title="API Keys" icon="lucide:key" icon-color="amber">
        <template #header-right>
          <GlassButton variant="secondary" size="sm" icon-left="lucide:plus">New Key</GlassButton>
        </template>
        <div class="space-y-3">
          <div v-for="key in apiKeys" :key="key.id"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div class="flex items-center gap-3">
              <code class="text-caption1 font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                {{ key.prefix }}••••••••
              </code>
              <div>
                <p class="text-callout font-medium text-slate-700 dark:text-slate-200">{{ key.name }}</p>
                <p class="text-caption2 text-slate-400">Last used {{ key.lastUsed }}</p>
              </div>
            </div>
            <GlassButton variant="ghost" size="sm" icon-left="lucide:trash-2" class="text-danger">Revoke</GlassButton>
          </div>
        </div>
      </LiquidGlassCard>

      <!-- Active Sessions -->
      <LiquidGlassCard title="Active Sessions" icon="lucide:monitor" icon-color="cyan">
        <div class="space-y-3">
          <div v-for="session in sessions" :key="session.id"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div class="flex items-center gap-3">
              <Icon :name="session.icon" class="w-5 h-5 text-slate-400" />
              <div>
                <p class="text-callout font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  {{ session.device }}
                  <span v-if="session.current" class="badge badge-green text-caption2">Current</span>
                </p>
                <p class="text-caption2 text-slate-400">{{ session.location }} · {{ session.lastSeen }}</p>
              </div>
            </div>
            <GlassButton v-if="!session.current" variant="ghost" size="sm">Revoke</GlassButton>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[var(--color-border)]">
          <GlassButton variant="destructive" size="sm" icon-left="lucide:log-out">Revoke All Other Sessions</GlassButton>
        </div>
      </LiquidGlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Security' })

const apiKeys = [
  { id: 1, name: 'Production API',    prefix: 'ek_live_', lastUsed: '2 hours ago' },
  { id: 2, name: 'Staging API',       prefix: 'ek_test_', lastUsed: 'Yesterday' },
  { id: 3, name: 'Analytics Webhook', prefix: 'ek_wh_',   lastUsed: '5 days ago' },
]

const sessions = [
  { id: 1, device: 'MacBook Pro — Chrome',   icon: 'lucide:laptop', location: 'Kuala Lumpur, MY', lastSeen: 'Now', current: true },
  { id: 2, device: 'iPhone 16 Pro — Safari', icon: 'lucide:smartphone', location: 'Kuala Lumpur, MY', lastSeen: '1 hour ago', current: false },
  { id: 3, device: 'iPad Pro — Safari',      icon: 'lucide:tablet', location: 'Singapore, SG', lastSeen: '3 days ago', current: false },
]
</script>
