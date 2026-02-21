<template>
  <div>
    <!-- Admin breadcrumb -->
    <div class="flex items-center gap-2 mb-6">
      <span class="badge badge-red text-caption1 font-bold animate-pulse-slow">SUPER ADMIN</span>
      <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
    </div>

    <!-- Platform KPI stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        v-for="(m, i) in platformMetrics"
        :key="m.key"
        v-bind="m"
        :index="i"
      />
    </div>

    <!-- Two pane layout -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <!-- Tenants table -->
      <LiquidGlassCard title="Recent Tenants" icon="lucide:building-2" icon-color="blue">
        <template #header-right>
          <GlassButton variant="primary" size="sm" icon-left="lucide:plus" @click="$router.push('/admin/tenants')">
            View All
          </GlassButton>
        </template>
        <div class="space-y-0 divide-y divide-[var(--color-border)] -mx-5">
          <div v-for="t in recentTenants" :key="t.id"
            class="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
                          flex items-center justify-center text-white text-callout font-bold">
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <p class="text-callout font-semibold text-slate-800 dark:text-white">{{ t.name }}</p>
                <p class="text-caption2 text-slate-400">{{ t.slug }}.app.com</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <PlanBadge :plan="t.plan" size="sm" />
              <span :class="t.status === 'active' ? 'badge-green' : t.status === 'trial' ? 'badge-amber' : 'badge-red'"
                class="badge text-caption2">{{ t.status }}</span>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      <!-- Platform revenue chart -->
      <LiquidGlassCard title="Platform MRR Trend" icon="lucide:trending-up" icon-color="green">
        <div class="h-52 flex items-end gap-1 pt-4">
          <div
            v-for="(bar, i) in mrrBars"
            :key="i"
            class="flex-1 bg-primary-500 rounded-t-sm opacity-80 hover:opacity-100 transition-all
                   relative group"
            :style="{ height: bar.h + '%' }"
          >
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white
                        text-[9px] px-1.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              ${{ bar.label }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-3 text-caption2 text-slate-400">
          <span>Jul 2025</span><span>Feb 2026</span>
        </div>
      </LiquidGlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Admin' })

const platformMetrics = [
  { key: 'tenants', label: 'Total Tenants',  icon: 'lucide:building-2', iconColor: 'blue',
    value: 428, previous: 391, delta: 9.5, trend: 'up' as const, format: 'integer' as const, sparkline: [310, 330, 355, 372, 391, 408, 428] },
  { key: 'mrr', label: 'Platform MRR',  icon: 'lucide:dollar-sign', iconColor: 'green',
    value: 194830000, previous: 172400000, delta: 13.0, trend: 'up' as const, format: 'currency' as const, sparkline: [1420, 1520, 1640, 1720, 1820, 1905, 1948] },
  { key: 'users', label: 'Total Users', icon: 'lucide:users', iconColor: 'purple',
    value: 12841, previous: 11204, delta: 14.6, trend: 'up' as const, format: 'integer' as const, sparkline: [9800, 10200, 10800, 11100, 11400, 12000, 12841] },
  { key: 'churn', label: 'Platform Churn', icon: 'lucide:user-minus', iconColor: 'red',
    value: 1.2, previous: 1.5, delta: -0.3, trend: 'down' as const, format: 'percent' as const, sparkline: [1.9, 1.8, 1.6, 1.5, 1.4, 1.3, 1.2] },
]

const recentTenants = [
  { id: 1, name: 'Acme Corp',         slug: 'acme',     plan: 'pro' as const,        status: 'active' },
  { id: 2, name: 'Globex Inc',        slug: 'globex',   plan: 'enterprise' as const, status: 'active' },
  { id: 3, name: 'Initech LLC',       slug: 'initech',  plan: 'starter' as const,    status: 'trial' },
  { id: 4, name: 'Umbrella Corp',     slug: 'umbrella', plan: 'pro' as const,        status: 'active' },
  { id: 5, name: 'Stark Industries',  slug: 'stark',    plan: 'enterprise' as const, status: 'active' },
]

const mrrBars = [18, 21, 20, 23, 25, 26, 25, 28, 30, 32, 35, 38].map((v, i) => ({
  h: Math.round((v / 40) * 100),
  label: `${v}k`,
}))
</script>
