<template>
  <div>
    <NuxtLayout name="onboarding">
      <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }">
        <div class="text-center mb-8">
          <h2 class="text-title2 font-bold text-slate-900 dark:text-white mb-1">Invite your team</h2>
          <p class="text-callout text-slate-500">Start with teammates — you can invite more later.</p>
        </div>

        <!-- Email inputs -->
        <div class="space-y-3 mb-6">
          <div v-for="(invite, i) in invites" :key="i" class="flex gap-2">
            <div class="relative flex-1">
              <Icon name="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="invites[i].email"
                type="email"
                :placeholder="`teammate${i + 1}@company.com`"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)]
                       bg-white dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all"
              />
            </div>
            <select
              v-model="invites[i].role"
              class="px-3 py-3 rounded-xl border border-[var(--color-border)] bg-white dark:bg-slate-800
                     text-callout text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="tenant_admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button v-if="invites.length > 1" class="touch-target rounded-xl text-slate-400 hover:text-danger transition-colors" @click="invites.splice(i, 1)">
              <Icon name="lucide:x" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          class="flex items-center gap-2 text-callout text-primary-600 font-medium mb-8 hover:text-primary-700 transition-colors"
          @click="invites.push({ email: '', role: 'member' })"
        >
          <Icon name="lucide:plus-circle" class="w-4 h-4" />
          Add another
        </button>

        <div class="flex gap-3">
          <GlassButton variant="secondary" size="lg" icon-left="lucide:arrow-left" @click="$router.push('/onboarding')">
            Back
          </GlassButton>
          <GlassButton variant="primary" size="lg" icon-right="lucide:arrow-right" class="flex-1 justify-center" @click="$router.push('/onboarding/plan')">
            Continue
          </GlassButton>
        </div>
        <button class="mx-auto block mt-4 text-caption1 text-slate-400 hover:text-slate-600" @click="$router.push('/onboarding/plan')">
          Skip for now
        </button>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { TenantRole } from '~/types'

definePageMeta({ middleware: ['auth'], layout: false })

interface InviteRow {
  email: string
  role: TenantRole
}

const invites = ref<InviteRow[]>([
  { email: '', role: 'member' },
  { email: '', role: 'member' },
])
</script>
