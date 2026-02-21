<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="badge badge-red text-caption1 font-bold">SUPER ADMIN</span>
          <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Tenant Management</h1>
        </div>
        <p class="text-footnote text-slate-500 mt-0.5">{{ tenants.length }} workspaces across the platform</p>
      </div>
      <GlassButton variant="primary" icon-left="lucide:plus">Create Tenant</GlassButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-5">
      <button
        v-for="f in statusFilters"
        :key="f.value"
        class="text-callout font-medium px-4 py-2 rounded-xl border transition-all"
        :class="activeFilter === f.value
          ? 'bg-primary-600 text-white border-primary-600'
          : 'border-[var(--color-border)] text-slate-600 dark:text-slate-300 hover:border-primary-300'"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
        <span class="ml-1 text-caption2 opacity-70">{{ f.count }}</span>
      </button>
    </div>

    <!-- Tenants table -->
    <DataTable
      title="All Tenants"
      :columns="columns"
      :rows="filteredTenants"
    >
      <template #cell-tenant="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
                      flex items-center justify-center text-white text-callout font-bold flex-shrink-0">
            {{ String(row.name).charAt(0) }}
          </div>
          <div>
            <p class="text-callout font-semibold text-slate-800 dark:text-white">{{ row.name }}</p>
            <p class="text-caption2 text-slate-400 font-mono">{{ row.slug }}.app.com</p>
          </div>
        </div>
      </template>
      <template #cell-plan="{ value }">
        <PlanBadge :plan="(value as any)" size="sm" :show-icon="true" />
      </template>
      <template #cell-status="{ value }">
        <span class="badge text-caption2"
          :class="{ 'badge-green': value === 'active', 'badge-amber': value === 'trial', 'badge-red': value === 'suspended', 'badge-gray': value === 'churned' }">
          {{ value }}
        </span>
      </template>
      <template #cell-mrr="{ value }">
        <span class="font-semibold tabular-nums">{{ value }}</span>
      </template>
      <template #actions>
        <GlassButton variant="ghost" size="sm" icon-left="lucide:download">Export CSV</GlassButton>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Tenants' })

const activeFilter = ref('all')

const statusFilters = [
  { value: 'all',       label: 'All',       count: 428 },
  { value: 'active',    label: 'Active',    count: 382 },
  { value: 'trial',     label: 'Trial',     count: 31 },
  { value: 'suspended', label: 'Suspended', count: 8 },
  { value: 'churned',   label: 'Churned',   count: 7 },
]

const columns = [
  { key: 'tenant',  label: 'Tenant', sortable: true },
  { key: 'plan',    label: 'Plan',   sortable: true },
  { key: 'seats',   label: 'Seats',  sortable: true, align: 'right' as const },
  { key: 'mrr',     label: 'MRR',    sortable: true, align: 'right' as const },
  { key: 'status',  label: 'Status', sortable: true },
  { key: 'created', label: 'Created', sortable: true },
]

const tenants = [
  { name: 'Acme Corp',        slug: 'acme',      plan: 'pro',        seats: '14/25', mrr: '$299',   status: 'active',    created: 'Jan 15, 2024' },
  { name: 'Globex Inc',       slug: 'globex',    plan: 'enterprise', seats: '54/∞',  mrr: '$4,999', status: 'active',    created: 'Feb 2, 2024' },
  { name: 'Initech LLC',      slug: 'initech',   plan: 'starter',    seats: '3/10',  mrr: '$99',    status: 'trial',     created: 'Feb 10, 2026' },
  { name: 'Umbrella Corp',    slug: 'umbrella',  plan: 'pro',        seats: '18/25', mrr: '$299',   status: 'active',    created: 'Mar 5, 2024' },
  { name: 'Dunder Mifflin',   slug: 'dunder',    plan: 'starter',    seats: '7/10',  mrr: '$99',    status: 'active',    created: 'Apr 12, 2024' },
  { name: 'Wernham Hogg',     slug: 'wernham',   plan: 'free',       seats: '2/3',   mrr: '$0',     status: 'active',    created: 'Jun 20, 2024' },
  { name: 'Stark Industries', slug: 'stark',     plan: 'enterprise', seats: '142/∞', mrr: '$4,999', status: 'active',    created: 'Aug 8, 2024' },
  { name: 'Prestige WW',      slug: 'prestige',  plan: 'pro',        seats: '9/25',  mrr: '$0',     status: 'suspended', created: 'Sep 1, 2024' },
]

const filteredTenants = computed(() =>
  activeFilter.value === 'all'
    ? tenants
    : tenants.filter(t => t.status === activeFilter.value),
)
</script>
