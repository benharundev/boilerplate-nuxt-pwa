<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <Icon name="lucide:users" class="w-5 h-5 text-slate-400" />
        <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Team</h1>
      </div>
      <GlassButton variant="primary" icon-left="lucide:user-plus" @click="showInvite = true">
        Invite Members
      </GlassButton>
    </div>

    <!-- Seat usage bar -->
    <div class="liquid-glass rounded-2xl p-4 mb-5 flex items-center gap-4">
      <Icon name="lucide:users" class="w-5 h-5 text-primary-600 flex-shrink-0" />
      <div class="flex-1">
        <div class="flex justify-between text-footnote mb-1">
          <span class="text-slate-500">{{ tenant?.usedSeats }} of {{ tenant?.seats }} seats used</span>
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ seatPercentage }}%</span>
        </div>
        <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
          <div class="h-full rounded-full bg-primary-500 transition-all duration-700" :style="{ width: seatPercentage + '%' }" />
        </div>
      </div>
      <GlassButton variant="outline" size="sm">Add seats</GlassButton>
    </div>

    <!-- Members table -->
    <DataTable
      title="Members"
      subtitle="All workspace members and their roles"
      :columns="columns"
      :rows="memberRows"
    >
      <template #cell-member="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-caption2 font-bold flex-shrink-0">
            {{ String(row.name).charAt(0) }}
          </div>
          <div>
            <p class="text-callout font-medium text-slate-800 dark:text-white">{{ row.name }}</p>
            <p class="text-caption2 text-slate-400">{{ row.email }}</p>
          </div>
        </div>
      </template>
      <template #cell-role="{ value }">
        <span class="text-caption1 font-semibold capitalize text-slate-600 dark:text-slate-300">
          {{ String(value).replace('_', ' ') }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <span class="badge text-caption2" :class="value === 'active' ? 'badge-green' : 'badge-amber'">
          {{ value }}
        </span>
      </template>
    </DataTable>

    <!-- Pending invites -->
    <div class="mt-5">
      <LiquidGlassCard title="Pending Invitations" icon="lucide:mail" icon-color="amber">
        <div class="space-y-3">
          <div v-for="inv in pendingInvites" :key="inv.email" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div class="flex items-center gap-3">
              <Icon name="lucide:clock" class="w-4 h-4 text-warning" />
              <div>
                <p class="text-callout font-medium text-slate-700 dark:text-slate-200">{{ inv.email }}</p>
                <p class="text-caption2 text-slate-400">Invited as {{ inv.role.replace('_', ' ') }} · Expires {{ inv.expires }}</p>
              </div>
            </div>
            <GlassButton variant="ghost" size="sm">Revoke</GlassButton>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Team' })
const { tenant, seatPercentage } = useTenant()
const showInvite = ref(false)

const columns = [
  { key: 'member', label: 'Member', sortable: true },
  { key: 'role',   label: 'Role',   sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true },
]

const memberRows = [
  { name: 'Alex Johnson', email: 'alex@acme.com',   role: 'tenant_owner', status: 'active', joined: 'Jan 15, 2024' },
  { name: 'Siti Aminah',  email: 'siti@acme.com',   role: 'tenant_admin', status: 'active', joined: 'Mar 2, 2024' },
  { name: 'Raj Patel',    email: 'raj@acme.com',    role: 'member',       status: 'active', joined: 'Apr 10, 2024' },
  { name: 'Mei Ling',     email: 'mei@acme.com',    role: 'member',       status: 'active', joined: 'Jun 22, 2024' },
  { name: 'David Kim',    email: 'david@acme.com',  role: 'viewer',       status: 'active', joined: 'Aug 5, 2024' },
]

const pendingInvites = [
  { email: 'finance@acme.com', role: 'tenant_admin', expires: 'Feb 28, 2026' },
  { email: 'cto@acme.com',     role: 'member',       expires: 'Mar 1, 2026' },
]
</script>
