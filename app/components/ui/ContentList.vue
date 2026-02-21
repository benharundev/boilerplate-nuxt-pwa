<template>
  <!--
    ContentList — Selectable list for master-detail pattern.
    Use on tablet/desktop as the left panel (e.g. emails, docs, members).
  -->
  <div class="flex flex-col h-full">

    <!-- List header + search -->
    <div class="px-4 pt-4 pb-2 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-headline font-bold text-slate-900 dark:text-white">{{ title }}</h2>
        <slot name="actions" />
      </div>

      <div v-if="searchable" class="relative">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder ?? 'Search…'"
          class="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--color-border)]
                 bg-slate-50 dark:bg-slate-800 text-callout text-slate-800 dark:text-slate-200
                 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all"
        />
      </div>
    </div>

    <!-- Items list -->
    <div class="flex-1 overflow-y-auto scroll-content-area px-2 py-1">

      <!-- Empty state -->
      <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="lucide:inbox" class="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
        <p class="text-callout font-medium text-slate-500">{{ emptyMessage ?? 'No items' }}</p>
        <p v-if="searchQuery" class="text-caption1 text-slate-400 mt-1">Try a different search term</p>
      </div>

      <!-- List rows -->
      <div
        v-for="(item, i) in filteredItems"
        :key="getKey(item)"
        v-motion
        :initial="{ opacity: 0, x: -8 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 200, delay: i * 30 } }"
        class="flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all pressable mb-0.5"
        :class="[
          selectedId === getKey(item)
            ? 'bg-primary-600 text-white shadow-sm'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
        @click="select(item)"
      >
        <!-- Left slot: avatar, icon, etc. -->
        <slot name="item-left" :item="item" :selected="selectedId === getKey(item)" />

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <p
              class="text-callout font-semibold truncate"
              :class="selectedId === getKey(item) ? 'text-white' : 'text-slate-800 dark:text-white'"
            >
              {{ getLabel(item) }}
            </p>
            <slot name="item-right" :item="item" :selected="selectedId === getKey(item)" />
          </div>

          <p
            v-if="getSublabel(item)"
            class="text-caption1 mt-0.5 truncate"
            :class="selectedId === getKey(item) ? 'text-white/70' : 'text-slate-400'"
          >
            {{ getSublabel(item) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(defineProps<{
  title: string
  items: T[]
  keyField?: keyof T
  labelField?: keyof T
  sublabelField?: keyof T
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  modelValue?: string | number | null
}>(), {
  keyField: 'id' as never,
  labelField: 'name' as never,
  searchable: true,
})

const emit = defineEmits<{
  'update:modelValue': [val: string | number | null]
  select: [item: T]
}>()

const searchQuery = ref('')
const selectedId  = ref<string | number | null>(props.modelValue ?? null)

watch(() => props.modelValue, v => { selectedId.value = v ?? null })

function getKey(item: T)      { return item[props.keyField] as string | number }
function getLabel(item: T)    { return item[props.labelField] as string }
function getSublabel(item: T) { return props.sublabelField ? item[props.sublabelField] as string : undefined }

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  const q = searchQuery.value.toLowerCase()
  return props.items.filter(item =>
    String(getLabel(item)).toLowerCase().includes(q) ||
    (getSublabel(item) && String(getSublabel(item)).toLowerCase().includes(q)),
  )
})

function select(item: T) {
  const key = getKey(item)
  selectedId.value = key
  emit('update:modelValue', key)
  emit('select', item)
}
</script>
