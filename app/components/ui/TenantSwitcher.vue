<template>
  <!-- Tenant Switcher — compact dropdown in sidebar -->
  <div class="relative" ref="dropdownRef">
    <button
      class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
             hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pressable"
      @click="open = !open"
    >
      <!-- Tenant avatar -->
      <div class="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 text-white text-caption1 font-bold">
        {{ tenant?.name?.[0] ?? 'A' }}
      </div>

      <div class="flex-1 min-w-0 text-left">
        <p class="text-footnote font-semibold text-slate-800 dark:text-white truncate leading-tight">
          {{ tenant?.name }}
        </p>
        <div class="flex items-center gap-1.5">
          <PlanBadge :plan="tenant?.plan ?? 'free'" size="xs" />
        </div>
      </div>

      <Icon
        name="lucide:chevrons-up-down"
        class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown -->
    <Transition name="pop">
      <div
        v-if="open"
        class="absolute left-0 right-0 top-full mt-1 z-50
               material-chrome rounded-xl shadow-glass-lg overflow-hidden border border-[var(--color-border)]"
      >
        <div class="p-1">
          <button
            v-for="m in tenants"
            :key="m.tenant.id"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100
                   dark:hover:bg-slate-800 transition-colors text-left pressable"
            :class="m.tenant.id === tenant?.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''"
            @click="handleSwitch(m.tenant.slug)"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700
                        flex items-center justify-center text-white text-footnote font-bold flex-shrink-0">
              {{ m.tenant.name[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-footnote font-semibold text-slate-800 dark:text-white truncate">{{ m.tenant.name }}</p>
              <p class="text-caption2 text-slate-400 capitalize">{{ m.role.replace('_', ' ') }}</p>
            </div>
            <Icon
              v-if="m.tenant.id === tenant?.id"
              name="lucide:check"
              class="w-4 h-4 text-primary-600 flex-shrink-0"
            />
          </button>
        </div>

        <div class="divider" />

        <div class="p-1">
          <button
            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                   hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-callout text-slate-500"
          >
            <Icon name="lucide:plus-circle" class="w-4 h-4" />
            Create workspace
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { tenant, tenants, switchTenant, isLoading } = useTenant()
const haptics = useHaptics()
const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

onClickOutside(dropdownRef, () => { open.value = false })

async function handleSwitch(slug: string) {
  open.value = false
  haptics.medium()
  await switchTenant(slug)
}
</script>
