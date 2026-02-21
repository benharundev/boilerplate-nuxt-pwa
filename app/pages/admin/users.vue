<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="badge badge-red text-caption1 font-bold">SUPER ADMIN</span>
          <h1 class="text-title2 font-bold text-slate-900 dark:text-white">User Management</h1>
        </div>
        <p class="text-footnote text-slate-500 mt-0.5">All users across every workspace</p>
      </div>
      <GlassButton variant="primary" icon-left="lucide:user-plus">Add User</GlassButton>
    </div>

    <!-- Role filter -->
    <div class="flex flex-wrap gap-2 mb-5">
      <button
        v-for="f in roleFilters"
        :key="f.value"
        class="text-callout font-medium px-4 py-2 rounded-xl border transition-all"
        :class="activeRole === f.value
          ? 'bg-primary-600 text-white border-primary-600'
          : 'border-[var(--color-border)] text-slate-600 dark:text-slate-300 hover:border-primary-300'"
        @click="activeRole = f.value"
      >
        {{ f.label }} <span class="ml-1 text-caption2 opacity-70">{{ f.count }}</span>
      </button>
    </div>

    <DataTable
      title="All Users"
      :columns="columns"
      :rows="filteredUsers"
    >
      <template #cell-user="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-callout font-bold flex-shrink-0 overflow-hidden">
            <img v-if="row.avatar" :src="String(row.avatar)" :alt="String(row.name)" class="w-full h-full object-cover" />
            <span v-else>{{ String(row.name).charAt(0) }}</span>
          </div>
          <div>
            <p class="text-callout font-semibold text-slate-800 dark:text-white">{{ row.name }}</p>
            <p class="text-caption2 text-slate-400">{{ row.email }}</p>
          </div>
        </div>
      </template>
      <template #cell-role="{ value }">
        <span class="badge text-caption2"
          :class="{
            'badge-red':   value === 'super_admin',
            'badge-blue':  value === 'tenant_owner',
            'badge-green': value === 'tenant_admin',
            'badge-gray':  value === 'member' || value === 'viewer',
          }">
          {{ String(value).replace(/_/g, ' ') }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <span class="badge text-caption2" :class="value === 'active' ? 'badge-green' : value === 'pending' ? 'badge-amber' : 'badge-red'">
          {{ value }}
        </span>
      </template>
      <template #cell-mfa="{ value }">
        <Icon
          :name="value ? 'lucide:shield-check' : 'lucide:shield-x'"
          class="w-4 h-4"
          :class="value ? 'text-success' : 'text-slate-300'"
        />
      </template>
      <template #actions>
        <GlassButton variant="ghost" size="sm" icon-left="lucide:download">Export CSV</GlassButton>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Users' })

const activeRole = ref('all')
const roleFilters = [
  { value: 'all',          label: 'All',          count: 12841 },
  { value: 'super_admin',  label: 'Super Admin',  count: 3 },
  { value: 'tenant_owner', label: 'Tenant Owner', count: 428 },
  { value: 'tenant_admin', label: 'Admin',        count: 1242 },
  { value: 'member',       label: 'Member',       count: 10842 },
]

const columns = [
  { key: 'user',    label: 'User',       sortable: true },
  { key: 'role',    label: 'Role',       sortable: true },
  { key: 'tenant',  label: 'Workspace',  sortable: true },
  { key: 'status',  label: 'Status',     sortable: true },
  { key: 'mfa',     label: '2FA',        sortable: false },
  { key: 'joined',  label: 'Joined',     sortable: true },
]

const users = [
  { name: 'Alex Johnson',  email: 'alex@acme.com',     role: 'tenant_owner', tenant: 'Acme Corp',    status: 'active',  mfa: false, joined: 'Jan 15, 2024',  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=alex' },
  { name: 'Siti Aminah',   email: 'siti@acme.com',     role: 'tenant_admin', tenant: 'Acme Corp',    status: 'active',  mfa: true,  joined: 'Mar 2, 2024',   avatar: '' },
  { name: 'Tony Stark',    email: 'tony@stark.com',    role: 'tenant_owner', tenant: 'Stark Ind.',   status: 'active',  mfa: true,  joined: 'Aug 8, 2024',   avatar: '' },
  { name: 'System Admin',  email: 'admin@platform.io', role: 'super_admin',  tenant: 'Platform',     status: 'active',  mfa: true,  joined: 'Jan 1, 2024',   avatar: '' },
  { name: 'Raj Patel',     email: 'raj@initech.com',   role: 'tenant_owner', tenant: 'Initech LLC',  status: 'active',  mfa: false, joined: 'Feb 10, 2026',  avatar: '' },
  { name: 'Mei Ling',      email: 'mei@acme.com',      role: 'member',       tenant: 'Acme Corp',    status: 'active',  mfa: false, joined: 'Jun 22, 2024',  avatar: '' },
  { name: 'David Kim',     email: 'david@acme.com',    role: 'viewer',       tenant: 'Acme Corp',    status: 'active',  mfa: false, joined: 'Aug 5, 2024',   avatar: '' },
  { name: 'New User',      email: 'new@company.com',   role: 'member',       tenant: 'Globex Inc',   status: 'pending', mfa: false, joined: 'Feb 21, 2026',  avatar: '' },
]

const filteredUsers = computed(() =>
  activeRole.value === 'all'
    ? users
    : users.filter(u => u.role === activeRole.value),
)
</script>
