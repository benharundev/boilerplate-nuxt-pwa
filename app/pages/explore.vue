<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-title1 font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
        <p class="text-callout text-slate-500 mt-0.5">Deep-dive into workspace performance metrics</p>
      </div>
      <div class="flex gap-2">
        <GlassButton variant="secondary" icon-left="lucide:calendar" size="sm">Last 30 days</GlassButton>
        <GlassButton variant="secondary" icon-left="lucide:download" size="sm">Export</GlassButton>
      </div>
    </div>

    <!-- Top metrics row -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <StatCard v-for="(m, i) in analyticsMetrics" :key="m.key" v-bind="m" :index="i" />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      <!-- User activity heat-map (dots) -->
      <LiquidGlassCard title="User Activity" subtitle="Daily active users — last 8 weeks" icon="lucide:activity" icon-color="blue" :index="1">
        <div class="grid grid-cols-7 gap-1 mt-2">
          <div
            v-for="(day, i) in activityHeatmap"
            :key="i"
            class="h-8 rounded-md transition-all"
            :class="heatClass(day)"
            :title="`${day} users`"
          />
        </div>
        <div class="flex justify-between mt-2 text-caption2 text-slate-400">
          <span>8 weeks ago</span><span>This week</span>
        </div>
      </LiquidGlassCard>

      <!-- Top pages -->
      <LiquidGlassCard title="Top Pages" subtitle="By page views this month" icon="lucide:bar-chart-2" icon-color="green" :index="2">
        <div class="space-y-3 mt-1">
          <div v-for="page in topPages" :key="page.path" class="flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex justify-between text-footnote mb-1">
                <span class="font-medium text-slate-700 dark:text-slate-200 truncate">{{ page.path }}</span>
                <span class="tabular-nums text-slate-500 flex-shrink-0 ml-2">{{ page.views.toLocaleString() }}</span>
              </div>
              <div class="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div class="h-full bg-primary-500 rounded-full" :style="{ width: page.pct + '%' }" />
              </div>
            </div>
          </div>
        </div>
      </LiquidGlassCard>
    </div>

    <!-- Events table -->
    <DataTable
      title="Recent Events"
      subtitle="User actions and system events"
      :columns="eventColumns"
      :rows="eventRows"
    >
      <template #cell-type="{ value }">
        <span class="badge text-caption2"
          :class="{ 'badge-green': value === 'signup', 'badge-blue': value === 'upgrade', 'badge-amber': value === 'login', 'badge-red': value === 'churn' }">
          {{ value }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Analytics' })

const analyticsMetrics = [
  { key: 'dau',  label: 'Daily Active Users',  icon: 'lucide:users',        iconColor: 'blue',
    value: 3842, previous: 3612, delta: 6.4, trend: 'up' as const, format: 'integer' as const, sparkline: [3100, 3250, 3400, 3520, 3612, 3720, 3842] },
  { key: 'sess', label: 'Avg. Session Length', icon: 'lucide:clock',         iconColor: 'purple',
    value: 8.4,  previous: 7.2, delta: 16.7, trend: 'up' as const, format: 'number' as const, unit: 'min', sparkline: [6.8, 7.0, 7.2, 7.4, 7.8, 8.1, 8.4] },
  { key: 'conv', label: 'Trial → Paid Conv.',  icon: 'lucide:arrow-up-right', iconColor: 'green',
    value: 32.4, previous: 28.1, delta: 15.3, trend: 'up' as const, format: 'percent' as const, sparkline: [24, 26, 27, 28, 29, 31, 32] },
]

// Heat map: random-ish activity data (0-100)
const activityHeatmap = Array.from({ length: 56 }, (_, i) =>
  Math.round(20 + Math.random() * 80 * (i / 56)),
)

function heatClass(val: number) {
  if (val < 20) return 'bg-slate-100 dark:bg-slate-800'
  if (val < 40) return 'bg-primary-100 dark:bg-primary-950'
  if (val < 60) return 'bg-primary-200 dark:bg-primary-900'
  if (val < 80) return 'bg-primary-400'
  return 'bg-primary-600'
}

interface TopPage {
  path: string
  views: number
  pct: number
}

const topPages: TopPage[] = [
  { path: '/dashboard',         views: 48204, pct: 100 },
  { path: '/explore',           views: 31820, pct: 66 },
  { path: '/settings/billing',  views: 14290, pct: 30 },
  { path: '/settings/team',     views: 11840, pct: 25 },
  { path: '/profile',           views: 9720,  pct: 20 },
]

const eventColumns = [
  { key: 'user',    label: 'User',      sortable: true },
  { key: 'type',    label: 'Event',     sortable: true },
  { key: 'details', label: 'Details' },
  { key: 'time',    label: 'Time',      sortable: true },
]

interface EventRow {
  user: string
  type: 'upgrade' | 'login' | 'signup' | 'churn' | string
  details: string
  time: string
}

const eventRows: EventRow[] = [
  { user: 'alex@acme.com',   type: 'upgrade', details: 'Upgraded from Starter → Pro',   time: '2m ago' },
  { user: 'siti@globex.com', type: 'login',   details: 'Login from MacBook (Chrome)',    time: '5m ago' },
  { user: 'raj@initech.com', type: 'signup',  details: 'New workspace: initech',         time: '12m ago' },
  { user: 'mei@acme.com',    type: 'login',   details: 'Login from iPhone (Safari)',     time: '18m ago' },
  { user: 'dave@wernham.com', type: 'churn',  details: 'Workspace cancelled (Pro plan)', time: '1h ago' },
]
</script>
