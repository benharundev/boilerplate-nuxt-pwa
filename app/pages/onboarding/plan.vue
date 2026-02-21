<template>
  <div>
    <NuxtLayout name="onboarding">
      <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }">
        <div class="text-center mb-8">
          <h2 class="text-title2 font-bold text-slate-900 dark:text-white mb-1">Choose your plan</h2>
          <p class="text-callout text-slate-500">Start free, upgrade anytime. Cancel anytime.</p>

          <!-- Billing toggle -->
          <div class="inline-flex items-center gap-3 mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <button
              class="px-4 py-1.5 rounded-full text-footnote font-medium transition-all"
              :class="interval === 'month' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'"
              @click="interval = 'month'"
            >Monthly</button>
            <button
              class="px-4 py-1.5 rounded-full text-footnote font-medium transition-all flex items-center gap-1.5"
              :class="interval === 'year' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'"
              @click="interval = 'year'"
            >
              Annual
              <span class="text-[10px] font-bold bg-success text-white px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <!-- Plan cards -->
        <div class="space-y-3 mb-8">
          <button
            v-for="plan in plans"
            :key="plan.id"
            class="w-full text-left p-4 rounded-2xl border-2 transition-all"
            :class="selectedPlan === plan.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-[var(--color-border)] hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-slate-800'"
            @click="selectedPlan = plan.id"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-headline font-bold text-slate-900 dark:text-white">{{ plan.name }}</p>
                  <PlanBadge :plan="plan.id" size="sm" :show-icon="true" />
                  <span v-if="plan.isPopular" class="text-caption2 font-bold px-2 py-0.5 bg-primary-600 text-white rounded-full">Most Popular</span>
                </div>
                <p class="text-caption1 text-slate-500">{{ plan.description }}</p>
              </div>
              <div class="text-right ml-4 flex-shrink-0">
                <p class="text-title3 font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ${{ interval === 'year' ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice }}
                </p>
                <p class="text-caption2 text-slate-400">/ mo</p>
              </div>
            </div>
          </button>
        </div>

        <GlassButton variant="primary" size="xl" class="w-full justify-center" :loading="isLoading" @click="finish">
          {{ selectedPlan === 'free' ? 'Start Free Trial →' : 'Start with ' + (plans.find(p => p.id === selectedPlan)?.name) }}
        </GlassButton>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { PlanId } from '~/types'
definePageMeta({ middleware: ['auth'], layout: false })

const router    = useRouter()
const interval  = ref<'month' | 'year'>('month')
const selectedPlan = ref<PlanId>('pro')
const isLoading = ref(false)

const plans = [
  { id: 'free',       name: 'Free',       monthlyPrice: 0,    description: 'Up to 3 seats. Great for small teams.', isPopular: false },
  { id: 'starter',    name: 'Starter',    monthlyPrice: 99,   description: 'Up to 10 seats, 10 GB storage, email support.', isPopular: false },
  { id: 'pro',        name: 'Pro',        monthlyPrice: 299,  description: 'Up to 25 seats, 50 GB, API access, priority support.', isPopular: true },
  { id: 'enterprise', name: 'Enterprise', monthlyPrice: 999,  description: 'Unlimited seats, SSO, SLA, dedicated CSM.', isPopular: false },
]

async function finish() {
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  router.push('/')
}
</script>
