<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="badge badge-red text-caption1 font-bold">SUPER ADMIN</span>
          <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Plan Management</h1>
        </div>
        <p class="text-footnote text-slate-500 mt-0.5">Configure plans, pricing, and feature flags</p>
      </div>
      <GlassButton variant="primary" icon-left="lucide:plus">New Plan</GlassButton>
    </div>

    <!-- Billing mode toggle -->
    <div class="flex items-center gap-3 mb-6">
      <span class="text-callout text-slate-500">View:</span>
      <div class="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
        <button
          v-for="m in ['Monthly','Annual']"
          :key="m"
          class="px-4 py-1.5 rounded-full text-footnote font-medium transition-all"
          :class="billingMode === m ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'"
          @click="billingMode = m"
        >{{ m }}</button>
      </div>
    </div>

    <!-- Plan cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <div
        v-for="(plan, i) in plans"
        :key="plan.id"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 350, delay: i * 80 } }"
        class="liquid-glass rounded-2xl p-5 flex flex-col relative"
        :class="plan.isPopular ? 'ring-2 ring-primary-500' : ''"
      >
        <div v-if="plan.isPopular" class="absolute -top-3 left-1/2 -translate-x-1/2">
          <span class="badge bg-primary-600 text-white text-caption2 px-3 py-1 rounded-full font-semibold">Most Popular</span>
        </div>

        <div class="flex items-center justify-between mb-4">
          <PlanBadge :plan="plan.id" size="md" :show-icon="true" />
          <GlassButton variant="ghost" size="sm" icon-left="lucide:pencil">Edit</GlassButton>
        </div>

        <!-- Pricing -->
        <div class="mb-4">
          <p class="text-large-title font-extrabold text-slate-900 dark:text-white tabular-nums leading-none">
            ${{ billingMode === 'Annual' ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice }}
          </p>
          <p class="text-caption1 text-slate-400 mt-0.5">/ seat / month {{ billingMode === 'Annual' ? '(annual)' : '' }}</p>
        </div>

        <!-- Stats -->
        <div class="space-y-2 mb-5 flex-1">
          <div class="flex justify-between text-footnote">
            <span class="text-slate-500">Active workspaces</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ plan.workspaces }}</span>
          </div>
          <div class="flex justify-between text-footnote">
            <span class="text-slate-500">Total seats</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ plan.seats }}</span>
          </div>
          <div class="flex justify-between text-footnote">
            <span class="text-slate-500">Monthly revenue</span>
            <span class="font-semibold text-success">{{ plan.mrr }}</span>
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-1.5 border-t border-[var(--color-border)] pt-4">
          <div v-for="feat in plan.features" :key="feat.label" class="flex items-center gap-2 text-caption1">
            <Icon
              :name="feat.enabled ? 'lucide:check' : 'lucide:x'"
              class="w-3.5 h-3.5 flex-shrink-0"
              :class="feat.enabled ? 'text-success' : 'text-slate-300'"
            />
            <span :class="feat.enabled ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'">
              {{ feat.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature flags table -->
    <LiquidGlassCard title="Feature Flag Matrix" icon="lucide:toggle-right" icon-color="purple">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[600px]">
          <thead>
            <tr class="border-b border-[var(--color-border)]">
              <th class="text-left py-2 px-3 text-caption1 text-slate-400 font-semibold uppercase tracking-wider w-48">Feature</th>
              <th v-for="p in plans" :key="p.id" class="text-center py-2 px-3 w-24">
                <PlanBadge :plan="p.id" size="xs" />
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="feat in featureFlags" :key="feat.key" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="py-2.5 px-3 text-callout text-slate-700 dark:text-slate-200">{{ feat.label }}</td>
              <td v-for="p in plans" :key="p.id" class="py-2.5 px-3 text-center">
                <Icon
                  :name="feat.plans.includes(p.id) ? 'lucide:check-circle' : 'lucide:circle'"
                  class="w-4 h-4 mx-auto"
                  :class="feat.plans.includes(p.id) ? 'text-success' : 'text-slate-200 dark:text-slate-700'"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </LiquidGlassCard>
  </div>
</template>

<script setup lang="ts">
import type { PlanId } from '~/types'
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Plans' })

const billingMode = ref('Monthly')

const plans = [
  {
    id: 'free' as PlanId, monthlyPrice: 0,    workspaces: 1820,  seats: '5.2k',   mrr: '$0',
    isPopular: false,
    features: [
      { label: '3 seats', enabled: true },
      { label: '1 GB storage', enabled: true },
      { label: 'Basic analytics', enabled: true },
      { label: 'API access', enabled: false },
      { label: 'Custom domain', enabled: false },
      { label: 'SSO / SAML', enabled: false },
    ],
  },
  {
    id: 'starter' as PlanId, monthlyPrice: 99, workspaces: 1240, seats: '8.4k',  mrr: '$122,760',
    isPopular: false,
    features: [
      { label: '10 seats', enabled: true },
      { label: '10 GB storage', enabled: true },
      { label: 'Advanced analytics', enabled: true },
      { label: 'API access', enabled: false },
      { label: 'Custom domain', enabled: false },
      { label: 'SSO / SAML', enabled: false },
    ],
  },
  {
    id: 'pro' as PlanId, monthlyPrice: 299, workspaces: 428, seats: '9.8k',     mrr: '$127,972',
    isPopular: true,
    features: [
      { label: '25 seats', enabled: true },
      { label: '50 GB storage', enabled: true },
      { label: 'Advanced analytics', enabled: true },
      { label: 'API access', enabled: true },
      { label: 'Custom domain', enabled: true },
      { label: 'SSO / SAML', enabled: false },
    ],
  },
  {
    id: 'enterprise' as PlanId, monthlyPrice: 999, workspaces: 84, seats: '12k+', mrr: '$83,916',
    isPopular: false,
    features: [
      { label: 'Unlimited seats', enabled: true },
      { label: 'Unlimited storage', enabled: true },
      { label: 'Advanced analytics', enabled: true },
      { label: 'API access', enabled: true },
      { label: 'Custom domain', enabled: true },
      { label: 'SSO / SAML', enabled: true },
    ],
  },
]

const featureFlags = [
  { key: 'api',        label: 'API Access',        plans: ['pro', 'enterprise'] },
  { key: 'customDomain', label: 'Custom Domain',  plans: ['pro', 'enterprise'] },
  { key: 'sso',        label: 'SSO / SAML',        plans: ['enterprise'] },
  { key: 'audit',      label: 'Audit Logs',        plans: ['pro', 'enterprise'] },
  { key: 'webhooks',   label: 'Webhooks',          plans: ['pro', 'enterprise'] },
  { key: 'sla',        label: 'SLA Guarantee',     plans: ['enterprise'] },
  { key: 'whitelabel', label: 'White-label',       plans: ['enterprise'] },
  { key: 'dedCSM',     label: 'Dedicated CSM',     plans: ['enterprise'] },
]
</script>
