<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <Icon name="lucide:credit-card" class="w-5 h-5 text-slate-400" />
      <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Billing</h1>
    </div>

    <div class="space-y-5">
      <!-- Current plan -->
      <LiquidGlassCard title="Current Plan" icon="lucide:zap" icon-color="blue">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <PlanBadge :plan="tenant?.plan ?? 'free'" size="md" :show-icon="true" />
            <span class="text-callout text-slate-500">Billed annually</span>
          </div>
          <div class="text-right">
            <p class="text-title3 font-extrabold text-slate-900 dark:text-white tabular-nums">$239/mo</p>
            <p class="text-caption1 text-slate-400">$2,868 billed annually</p>
          </div>
        </div>

        <!-- Usage bars -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div v-for="u in usageItems" :key="u.label" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p class="text-caption1 text-slate-500 mb-1">{{ u.label }}</p>
            <p class="text-headline font-bold text-slate-800 dark:text-white tabular-nums">{{ u.used }} <span class="text-caption1 font-normal text-slate-400">/ {{ u.limit }}</span></p>
            <div class="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2">
              <div class="h-full rounded-full bg-primary-500" :style="{ width: u.pct + '%' }" />
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <GlassButton variant="primary" icon-left="lucide:arrow-up-circle" @click="showUpgrade = true">Upgrade Plan</GlassButton>
          <GlassButton variant="outline" icon-left="lucide:arrow-down-circle">Downgrade</GlassButton>
        </div>
      </LiquidGlassCard>

      <!-- Payment method -->
      <LiquidGlassCard title="Payment Method" icon="lucide:credit-card" icon-color="green">
        <div class="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)]">
          <div class="flex items-center gap-4">
            <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-caption2 font-bold">VISA</div>
            <div>
              <p class="text-callout font-semibold text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
              <p class="text-caption1 text-slate-400">Expires 12/27</p>
            </div>
          </div>
          <GlassButton variant="secondary" size="sm">Update</GlassButton>
        </div>
      </LiquidGlassCard>

      <!-- Invoices -->
      <LiquidGlassCard title="Invoice History" icon="lucide:receipt" icon-color="amber">
        <div class="space-y-0 divide-y divide-[var(--color-border)]">
          <div
            v-for="inv in invoices"
            :key="inv.id"
            class="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50
                   -mx-5 px-5 transition-colors"
          >
            <div>
              <p class="text-callout font-medium text-slate-800 dark:text-white">{{ inv.period }}</p>
              <p class="text-caption1 text-slate-400">Invoice #{{ inv.number }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="badge badge-green text-caption2">{{ inv.status }}</span>
              <span class="text-callout font-semibold tabular-nums text-slate-800 dark:text-white">${{ inv.amount }}</span>
              <GlassButton variant="ghost" size="sm" icon-left="lucide:download">PDF</GlassButton>
            </div>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Billing' })
const { tenant } = useTenant()
const showUpgrade = ref(false)

const usageItems = [
  { label: 'Seats',    used: 14,      limit: 25,         pct: 56 },
  { label: 'Storage',  used: '4.2 GB', limit: '50 GB',   pct: 8 },
  { label: 'API Calls', used: '84k',  limit: '500k',     pct: 17 },
]

const invoices = [
  { id: 1, period: 'February 2026', number: 'INV-0024', amount: '2,868', status: 'paid' },
  { id: 2, period: 'February 2025', number: 'INV-0012', amount: '2,868', status: 'paid' },
  { id: 3, period: 'February 2024', number: 'INV-0001', amount: '1,980', status: 'paid' },
]
</script>
