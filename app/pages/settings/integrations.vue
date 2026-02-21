<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <Icon name="lucide:puzzle" class="w-5 h-5 text-slate-400" />
      <h1 class="text-title2 font-bold text-slate-900 dark:text-white">Integrations</h1>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        v-model="search"
        type="text"
        placeholder="Search integrations…"
        class="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)]
               bg-white dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200
               focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all"
      />
    </div>

    <!-- Category tabs -->
    <div class="flex gap-2 mb-5 overflow-x-auto pb-1">
      <button
        v-for="cat in categories"
        :key="cat"
        class="flex-shrink-0 text-callout font-medium px-4 py-2 rounded-xl transition-all"
        :class="activeCategory === cat
          ? 'bg-primary-600 text-white'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-[var(--color-border)] hover:border-primary-300'"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Integration grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(integration, i) in filteredIntegrations"
        :key="integration.id"
        v-motion
        :initial="{ opacity: 0, y: 12 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 300, delay: i * 60 } }"
        class="liquid-glass rounded-2xl p-5 flex flex-col gap-3"
      >
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ background: integration.color + '20' }">
              <Icon :name="integration.icon" class="w-6 h-6" :style="{ color: integration.color }" />
            </div>
            <div>
              <p class="text-callout font-semibold text-slate-800 dark:text-white">{{ integration.name }}</p>
              <p class="text-caption2 text-slate-400">{{ integration.category }}</p>
            </div>
          </div>
          <!-- Toggle -->
          <button
            class="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
            :class="integration.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'"
            @click="integration.enabled = !integration.enabled"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
              :class="integration.enabled ? 'translate-x-5' : ''" />
          </button>
        </div>

        <!-- Description -->
        <p class="text-caption1 text-slate-500 leading-relaxed">{{ integration.description }}</p>

        <!-- Status + configure -->
        <div class="flex items-center justify-between mt-auto pt-1">
          <span class="badge text-caption2" :class="integration.enabled ? 'badge-green' : 'badge-gray'">
            {{ integration.enabled ? 'Connected' : 'Disabled' }}
          </span>
          <GlassButton v-if="integration.enabled" variant="ghost" size="sm" icon-left="lucide:settings">
            Configure
          </GlassButton>
          <GlassButton v-else variant="secondary" size="sm" icon-left="lucide:link">
            Connect
          </GlassButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], title: 'Integrations' })

const search = ref('')
const activeCategory = ref('All')
const categories = ['All', 'Communication', 'Analytics', 'Storage', 'CRM', 'DevOps']

const integrations = reactive([
  { id: 1,  name: 'Slack',           category: 'Communication', icon: 'lucide:hash',        color: '#611f69', enabled: true,  description: 'Get real-time notifications and alerts in your Slack channels.' },
  { id: 2,  name: 'Google Analytics', category: 'Analytics',     icon: 'lucide:bar-chart',   color: '#E37400', enabled: false, description: 'Track user behaviour and conversion funnels from your workspace.' },
  { id: 3,  name: 'GitHub',          category: 'DevOps',        icon: 'lucide:github',       color: '#24292e', enabled: true,  description: 'Link commits and pull requests to your workspace tasks.' },
  { id: 4,  name: 'Google Drive',    category: 'Storage',       icon: 'lucide:hard-drive',   color: '#4285F4', enabled: false, description: 'Attach files from Drive directly in the app.' },
  { id: 5,  name: 'Salesforce',      category: 'CRM',           icon: 'lucide:cloud',        color: '#00A1E0', enabled: false, description: 'Sync contacts and opportunities with your CRM pipeline.' },
  { id: 6,  name: 'HubSpot',         category: 'CRM',           icon: 'lucide:users',        color: '#FF7A59', enabled: false, description: 'Keep your marketing contacts and deals in sync.' },
  { id: 7,  name: 'Jira',            category: 'DevOps',        icon: 'lucide:trello',       color: '#0052CC', enabled: false, description: 'Sync issues and sprints with your project board.' },
  { id: 8,  name: 'Twilio',          category: 'Communication', icon: 'lucide:message-square', color: '#F22F46', enabled: false, description: 'Send SMS and WhatsApp alerts from workflow automations.' },
  { id: 9,  name: 'Stripe',          category: 'Analytics',     icon: 'lucide:credit-card',  color: '#635BFF', enabled: true,  description: 'View payment events and revenue data from your dashboard.' },
])

const filteredIntegrations = computed(() => {
  let items = integrations
  if (activeCategory.value !== 'All') {
    items = items.filter(i => i.category === activeCategory.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  }
  return items
})
</script>
