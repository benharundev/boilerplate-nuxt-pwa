<template>
  <div>
    <!-- ── Page header ──────────────────────────────────────────────── -->
    <div class="flex items-center justify-between mb-6">
      <div
        v-motion
        :initial="{ opacity: 0, x: -16 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 400 } }"
      >
        <h1 class="text-title1 font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p class="text-callout text-slate-500 dark:text-slate-400 mt-0.5">
          Good morning, {{ displayName }} 👋 — {{ formattedDate }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <GlassButton variant="secondary" icon-left="lucide:download" size="sm" class="hidden sm:flex">
          Export
        </GlassButton>
        <GlassButton variant="primary" icon-left="lucide:plus" size="sm">
          New Report
        </GlassButton>
      </div>
    </div>

    <!-- ── Trial banner ─────────────────────────────────────────────── -->
    <div
      v-if="isOnTrial"
      v-motion
      :initial="{ opacity: 0, height: 0 }"
      :enter="{ opacity: 1, height: 'auto', transition: { duration: 400 } }"
      class="mb-5 liquid-glass rounded-xl px-4 py-3 flex items-center gap-3 border-l-4 border-warning"
    >
      <Icon name="lucide:clock" class="w-5 h-5 text-warning flex-shrink-0" />
      <p class="text-callout text-slate-700 dark:text-slate-200 flex-1">
        Your trial ends in <strong>{{ trialDaysLeft }} days</strong>. Upgrade to Pro to unlock all features.
      </p>
      <GlassButton variant="primary" size="sm" @click="$router.push('/settings/billing')">
        Upgrade
      </GlassButton>
    </div>

    <!-- ── KPI Stat Cards ───────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        v-for="(metric, i) in kpiMetrics"
        :key="metric.key"
        v-bind="metric"
        :index="i"
      />
    </div>

    <!-- ── Main content area ────────────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

      <!-- Revenue Chart — 2/3 width on XL -->
      <LiquidGlassCard
        title="Monthly Recurring Revenue"
        subtitle="Last 12 months"
        icon="lucide:trending-up"
        icon-color="blue"
        class="xl:col-span-2"
        :index="1"
      >
        <template #header-right>
          <div class="flex gap-1">
            <button
              v-for="range in ['3M','6M','1Y','All']"
              :key="range"
              class="text-caption1 font-medium px-2.5 py-1 rounded-lg transition-colors"
              :class="chartRange === range
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'"
              @click="chartRange = range"
            >
              {{ range }}
            </button>
          </div>
        </template>

        <!-- SVG Bar Chart -->
        <div class="h-52 pt-2">
          <svg class="w-full h-full" viewBox="0 0 360 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#1C6EF2" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#1C6EF2" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient id="prevBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#94A3B8" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#94A3B8" stop-opacity="0.2" />
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <g class="text-slate-200 dark:text-slate-700">
              <line v-for="y in [0,40,80,120,160]" :key="y" x1="0" :y1="y" x2="360" :y2="y"
                stroke="currentColor" stroke-width="0.5" stroke-dasharray="4,4" />
            </g>

            <!-- Bars -->
            <g v-for="(bar, i) in chartBars" :key="i">
              <!-- Previous period (ghost) -->
              <rect
                :x="bar.x"
                :y="160 - bar.prevH"
                :width="bar.w * 0.42"
                :height="bar.prevH"
                rx="3"
                fill="url(#prevBarGrad)"
              />
              <!-- Current period -->
              <rect
                :x="bar.x + bar.w * 0.48"
                :y="160 - bar.h"
                :width="bar.w * 0.42"
                :height="bar.h"
                rx="3"
                fill="url(#barGrad)"
                class="animate-bar-fill origin-bottom"
              />
            </g>

            <!-- X-axis labels -->
            <g>
              <text
                v-for="(bar, i) in chartBars"
                :key="`l-${i}`"
                :x="bar.x + bar.w / 2"
                y="158"
                text-anchor="middle"
                class="fill-slate-400 dark:fill-slate-500"
                font-size="8"
                font-family="Inter, system-ui, sans-serif"
              >
                {{ bar.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-5 px-1 mt-2 pb-1">
          <div class="flex items-center gap-2 text-caption1 text-slate-500">
            <div class="w-3 h-3 rounded bg-primary-600" />
            Current period
          </div>
          <div class="flex items-center gap-2 text-caption1 text-slate-500">
            <div class="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600" />
            Previous period
          </div>
          <div class="ml-auto text-headline font-bold text-slate-900 dark:text-white tabular-nums">
            $284,320 <span class="text-caption1 font-medium text-success">+12.4%</span>
          </div>
        </div>
      </LiquidGlassCard>

      <!-- Seat usage + plan card — 1/3 width -->
      <LiquidGlassCard
        title="Workspace Usage"
        subtitle="Seats & plan status"
        icon="lucide:users"
        icon-color="purple"
        :index="2"
      >
        <!-- Plan badge -->
        <div class="mb-4">
          <PlanBadge :plan="tenant?.plan ?? 'free'" size="md" :show-icon="true" />
        </div>

        <!-- Seats -->
        <div class="mb-4">
          <div class="flex justify-between text-footnote mb-1.5">
            <span class="text-slate-500">Seats used</span>
            <span class="font-semibold text-slate-800 dark:text-white tabular-nums">
              {{ tenant?.usedSeats }} / {{ tenant?.seats }}
            </span>
          </div>
          <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="seatStatus === 'critical' ? 'bg-danger' : seatStatus === 'warning' ? 'bg-warning' : 'bg-success'"
              :style="{ width: `${seatPercentage}%` }"
            />
          </div>
        </div>

        <!-- Storage -->
        <div class="mb-5">
          <div class="flex justify-between text-footnote mb-1.5">
            <span class="text-slate-500">Storage</span>
            <span class="font-semibold text-slate-800 dark:text-white">4.2 GB / 20 GB</span>
          </div>
          <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full rounded-full bg-primary-500 transition-all duration-700" style="width: 21%" />
          </div>
        </div>

        <!-- API calls -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-4">
          <div>
            <p class="text-caption1 text-slate-500">API Calls</p>
            <p class="text-title3 font-bold text-slate-900 dark:text-white tabular-nums">84,320</p>
          </div>
          <div class="text-right">
            <p class="text-caption1 text-slate-500">Limit</p>
            <p class="text-callout font-semibold text-slate-600 dark:text-slate-300 tabular-nums">100k/mo</p>
          </div>
        </div>

        <GlassButton variant="outline" size="sm" icon-left="lucide:arrow-up-circle" class="w-full justify-center" @click="$router.push('/settings/billing')">
          Upgrade Plan
        </GlassButton>
      </LiquidGlassCard>
    </div>

    <!-- ── Recent Activity Table ─────────────────────────────────────── -->
    <DataTable
      title="Recent Transactions"
      subtitle="All payment activity across your workspace"
      :columns="transactionColumns"
      :rows="transactionRows"
      :per-page="8"
    >
      <template #actions>
        <GlassButton variant="ghost" icon-left="lucide:filter" size="sm">Filter</GlassButton>
      </template>

      <!-- Custom cell: status badge -->
      <template #cell-status="{ value }">
        <span
          class="badge text-caption2"
          :class="{
            'badge-green': value === 'paid',
            'badge-amber': value === 'pending',
            'badge-red': value === 'failed',
          }"
        >
          {{ value }}
        </span>
      </template>

      <!-- Custom cell: amount -->
      <template #cell-amount="{ value }">
        <span class="font-semibold tabular-nums text-slate-800 dark:text-white">
          ${{ Number(value).toLocaleString() }}
        </span>
      </template>

      <!-- Custom cell: customer -->
      <template #cell-customer="{ row }">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-caption2 font-bold flex-shrink-0">
            {{ String(row.customer).charAt(0) }}
          </div>
          <div>
            <p class="text-callout font-medium text-slate-800 dark:text-white">{{ row.customer }}</p>
            <p class="text-caption2 text-slate-400">{{ row.email }}</p>
          </div>
        </div>
      </template>
    </DataTable>

    <!-- ── FAB (mobile) ──────────────────────────────────────────────── -->
    <button
      class="fixed bottom-[96px] right-6 w-14 h-14 rounded-full bg-primary-600 text-white
             shadow-fab hover:shadow-fab-hover flex items-center justify-center
             md:hidden pressable animate-float z-50"
    >
      <Icon name="lucide:plus" class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DashboardMetrics } from '~/types'

definePageMeta({
  middleware: ['auth', 'tenant'],
  title: 'Dashboard',
})

const { displayName } = useAuth()
const { tenant, isOnTrial, trialDaysLeft, seatPercentage, seatStatus } = useTenant()

const chartRange = ref('6M')

const formattedDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
)

// ── KPI Metrics ─────────────────────────────────────────────────────────────
const kpiMetrics = [
  {
    key: 'mrr', label: 'Monthly Revenue', icon: 'lucide:dollar-sign', iconColor: 'green',
    value: 28432000, previous: 25320000, delta: 12.4, trend: 'up' as const,
    format: 'currency' as const, sparkline: [195, 210, 198, 220, 235, 248, 260],
  },
  {
    key: 'users', label: 'Active Users', icon: 'lucide:users', iconColor: 'blue',
    value: 42891, previous: 39621, delta: 8.2, trend: 'up' as const,
    format: 'integer' as const, sparkline: [320, 335, 318, 350, 380, 402, 428],
  },
  {
    key: 'churn', label: 'Churn Rate', icon: 'lucide:user-minus', iconColor: 'red',
    value: 1.8, previous: 2.1, delta: -0.3, trend: 'down' as const,
    format: 'percent' as const, sparkline: [2.4, 2.2, 2.3, 2.0, 1.9, 1.8, 1.8],
  },
  {
    key: 'nps', label: 'NPS Score', icon: 'lucide:heart', iconColor: 'purple',
    value: 68, previous: 61, delta: 11.4, trend: 'up' as const,
    format: 'integer' as const, sparkline: [55, 58, 60, 61, 64, 66, 68],
  },
]

// ── Chart bars ───────────────────────────────────────────────────────────────
const rawData = [
  { label: 'Jul', v: 18200, p: 16000 },
  { label: 'Aug', v: 21000, p: 17500 },
  { label: 'Sep', v: 19800, p: 18200 },
  { label: 'Oct', v: 23500, p: 19000 },
  { label: 'Nov', v: 24800, p: 20500 },
  { label: 'Dec', v: 26100, p: 21000 },
  { label: 'Jan', v: 25200, p: 22000 },
  { label: 'Feb', v: 27800, p: 23500 },
  { label: 'Mar', v: 28432, p: 24800 },
]

const chartBars = computed(() => {
  const max = Math.max(...rawData.flatMap(d => [d.v, d.p]))
  const W = 360, totalBars = rawData.length
  const barW = W / totalBars
  return rawData.map((d, i) => ({
    x: i * barW + 2,
    w: barW - 4,
    h: (d.v / max) * 140,
    prevH: (d.p / max) * 140,
    label: d.label,
  }))
})

// ── Transactions ─────────────────────────────────────────────────────────────
const transactionColumns = [
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'plan',     label: 'Plan',     sortable: true },
  { key: 'amount',   label: 'Amount',   sortable: true, align: 'right' as const },
  { key: 'status',   label: 'Status',   sortable: true },
  { key: 'date',     label: 'Date',     sortable: true },
]

const transactionRows = [
  { customer: 'Globex Inc',   email: 'billing@globex.com',  plan: 'Enterprise', amount: 4999, status: 'paid',    date: 'Feb 21, 2026' },
  { customer: 'Initech LLC',  email: 'admin@initech.com',   plan: 'Pro',        amount: 299,  status: 'paid',    date: 'Feb 20, 2026' },
  { customer: 'Umbrella Corp', email: 'finance@umbrella.com', plan: 'Starter',  amount: 99,   status: 'pending', date: 'Feb 20, 2026' },
  { customer: 'Dunder Mifflin', email: 'ap@dunder.com',     plan: 'Pro',        amount: 299,  status: 'paid',    date: 'Feb 19, 2026' },
  { customer: 'Stark Industries', email: 'tony@stark.com',  plan: 'Enterprise', amount: 4999, status: 'paid',    date: 'Feb 18, 2026' },
  { customer: 'Wernham Hogg', email: 'david@wernham.co.uk', plan: 'Starter',    amount: 99,   status: 'failed',  date: 'Feb 18, 2026' },
  { customer: 'Vandelay Industries', email: 'art@vandelay.com', plan: 'Pro',    amount: 299,  status: 'paid',    date: 'Feb 17, 2026' },
  { customer: 'Prestige WW',  email: 'michael@prestige.com', plan: 'Pro',       amount: 299,  status: 'paid',    date: 'Feb 16, 2026' },
]
</script>
