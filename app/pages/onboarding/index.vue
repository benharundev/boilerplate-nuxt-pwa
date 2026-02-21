<template>
  <div>
    <NuxtLayout name="onboarding">
      <!-- Welcome step -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="text-center mb-8">
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700
                      flex items-center justify-center mx-auto mb-5 shadow-fab animate-float">
            <Icon name="lucide:building-2" class="w-10 h-10 text-white" />
          </div>
          <h2 class="text-title1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome to Enterprise
          </h2>
          <p class="text-callout text-slate-500 max-w-sm mx-auto">
            Let's set up your workspace in just a few steps. It takes less than 2 minutes.
          </p>
        </div>

        <!-- Org name -->
        <div class="space-y-4 mb-8">
          <div>
            <label class="block text-footnote font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Organisation name
            </label>
            <input
              v-model="orgName"
              type="text"
              required
              autofocus
              placeholder="e.g. Acme Corp"
              class="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)]
                     bg-white dark:bg-slate-800 text-body text-slate-800 dark:text-slate-200
                     focus:outline-none focus:border-primary-500 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div>
            <label class="block text-footnote font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Workspace URL
            </label>
            <div class="flex items-center rounded-xl border-2 border-[var(--color-border)] bg-white dark:bg-slate-800 overflow-hidden">
              <span class="px-3 text-callout text-slate-400 bg-slate-50 dark:bg-slate-900 border-r border-[var(--color-border)] py-3.5 whitespace-nowrap">
                app.enterprise.io/
              </span>
              <input
                v-model="workspaceSlug"
                type="text"
                placeholder="acme"
                class="flex-1 px-3 py-3.5 text-callout text-slate-800 dark:text-slate-200 bg-transparent
                       focus:outline-none placeholder:text-slate-400"
              />
              <span class="pr-3">
                <Icon
                  :name="slugValid ? 'lucide:check-circle' : 'lucide:x-circle'"
                  class="w-4 h-4"
                  :class="slugValid ? 'text-success' : 'text-danger'"
                />
              </span>
            </div>
          </div>

          <div>
            <label class="block text-footnote font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Timezone
            </label>
            <select
              v-model="timezone"
              class="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)]
                     bg-white dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200
                     focus:outline-none focus:border-primary-500 transition-all"
            >
              <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="America/New_York">America/New York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
            </select>
          </div>
        </div>

        <GlassButton
          variant="primary"
          size="xl"
          icon-right="lucide:arrow-right"
          :disabled="!orgName || !slugValid"
          class="w-full justify-center"
          @click="nextStep"
        >
          Continue
        </GlassButton>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'], layout: false, title: 'Setup Workspace' })

const router = useRouter()
const orgName  = ref('')
const timezone = ref('Asia/Kuala_Lumpur')

const workspaceSlug = computed({
  get: () => orgName.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
  set: (v: string) => v,
})

const slugValid = computed(() => /^[a-z0-9][a-z0-9-]{2,29}$/.test(workspaceSlug.value))

function nextStep() {
  router.push('/onboarding/workspace')
}
</script>
