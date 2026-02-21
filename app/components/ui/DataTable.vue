<template>
  <!-- Enterprise dense data table with sort, pagination, row actions -->
  <div class="card overflow-hidden">
    <!-- ── Table header toolbar ─────────────────────────────────────── -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
      <div>
        <h3 class="text-headline font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
        <p v-if="subtitle" class="text-footnote text-slate-500">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative hidden sm:block">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Search…"
            class="pl-9 pr-4 py-2 text-callout rounded-xl border border-[var(--color-border)]
                   bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   w-52 transition-all"
          />
        </div>
        <slot name="actions" />
      </div>
    </div>

    <!-- ── Table (horizontal scroll on mobile) ─────────────────────── -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px]">
        <thead>
          <tr class="border-b border-[var(--color-border)] bg-slate-50 dark:bg-slate-800/50">
            <th
              v-for="col in columns"
              :key="col.key"
              class="text-left px-5 py-3 text-caption1 font-semibold text-slate-500 dark:text-slate-400
                     uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200"
              :class="col.align === 'right' ? 'text-right' : ''"
              @click="toggleSort(col.key)"
            >
              <span class="flex items-center gap-1.5" :class="col.align === 'right' ? 'justify-end' : ''">
                {{ col.label }}
                <Icon
                  v-if="sortBy === col.key"
                  :name="sortOrder === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  class="w-3 h-3 text-primary-600"
                />
                <Icon v-else name="lucide:chevrons-up-down" class="w-3 h-3 opacity-30" />
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-[var(--color-border)]">
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="columns.length" class="px-5 py-12 text-center text-slate-400 text-callout">
              <Icon name="lucide:search-x" class="w-8 h-8 mx-auto mb-2 opacity-50" />
              No results found
            </td>
          </tr>

          <tr
            v-for="(row, i) in paginatedRows"
            :key="i"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            v-motion
            :initial="{ opacity: 0, x: -8 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 250, delay: i * 30, ease: 'easeOut' } }"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-5 py-3.5 text-callout whitespace-nowrap"
              :class="col.align === 'right' ? 'text-right' : ''"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Pagination footer ────────────────────────────────────────── -->
    <div class="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)] bg-slate-50 dark:bg-slate-800/50">
      <p class="text-caption1 text-slate-500">
        Showing {{ startRow }}–{{ endRow }} of {{ filteredRows.length }} results
      </p>
      <div class="flex items-center gap-1">
        <button
          :disabled="page <= 1"
          class="touch-target rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300
                 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
          @click="page--"
        >
          <Icon name="lucide:chevron-left" class="w-4 h-4" />
        </button>

        <span class="px-3 py-1 text-caption1 text-slate-600 dark:text-slate-300">
          {{ page }} / {{ totalPages }}
        </span>

        <button
          :disabled="page >= totalPages"
          class="touch-target rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300
                 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
          @click="page++"
        >
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'right'
  sortable?: boolean
}

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  perPage?: number
}>(), { perPage: 10 })

const search  = ref('')
const page    = ref(1)
const sortBy  = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleSort(key: string) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
  page.value = 1
}

const filteredRows = computed(() => {
  let rows = [...props.rows]
  if (search.value) {
    const q = search.value.toLowerCase()
    rows = rows.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q)),
    )
  }
  if (sortBy.value) {
    const k = sortBy.value
    rows.sort((a, b) => {
      const av = String(a[k] ?? ''), bv = String(b[k] ?? '')
      return sortOrder.value === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / props.perPage)))
const startRow   = computed(() => (page.value - 1) * props.perPage + 1)
const endRow     = computed(() => Math.min(page.value * props.perPage, filteredRows.value.length))

const paginatedRows = computed(() =>
  filteredRows.value.slice((page.value - 1) * props.perPage, page.value * props.perPage),
)

// Reset page on search
watch(search, () => { page.value = 1 })
</script>
