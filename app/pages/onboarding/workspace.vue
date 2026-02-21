<template>
  <div>
    <NuxtLayout name="onboarding">
      <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }">
        <div class="text-center mb-8">
          <h2 class="text-title2 font-bold text-slate-900 dark:text-white mb-1">Customise your workspace</h2>
          <p class="text-callout text-slate-500">Brand it with your logo and colour.</p>
        </div>

        <!-- Logo upload -->
        <div class="mb-6">
          <label class="block text-footnote font-semibold text-slate-700 dark:text-slate-300 mb-2">Workspace Logo</label>
          <div class="flex items-center gap-4">
            <!-- Preview -->
            <div
              class="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-dashed
                     border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0"
              :style="logoPreview ? {} : { background: brandColor }"
            >
              <img v-if="logoPreview" :src="logoPreview" alt="Logo preview" class="w-full h-full object-contain p-1" />
              <Icon v-else name="lucide:building-2" class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1">
              <GlassButton variant="secondary" size="sm" icon-left="lucide:upload" @click="triggerUpload">
                Upload Logo
              </GlassButton>
              <p class="text-caption2 text-slate-400 mt-1.5">PNG or SVG, min 256×256px recommended</p>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </div>
          </div>
        </div>

        <!-- Brand colour -->
        <div class="mb-6">
          <label class="block text-footnote font-semibold text-slate-700 dark:text-slate-300 mb-2">Brand Colour</label>
          <div class="flex items-center gap-3 flex-wrap">
            <button
              v-for="colour in presetColours"
              :key="colour"
              class="w-8 h-8 rounded-full border-2 transition-all"
              :style="{ background: colour, borderColor: brandColor === colour ? colour : 'transparent' }"
              :class="brandColor === colour ? 'ring-2 ring-offset-2 ring-primary-500' : ''"
              @click="brandColor = colour"
            />
            <label class="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
              <Icon name="lucide:pipette" class="w-4 h-4 text-slate-400" />
              <input v-model="brandColor" type="color" class="hidden" />
            </label>
            <code class="text-caption1 font-mono text-slate-500 ml-1">{{ brandColor }}</code>
          </div>
        </div>

        <!-- Display Name -->
        <div class="mb-8">
          <label class="block text-footnote font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Display Name</label>
          <input
            v-model="displayName"
            type="text"
            placeholder="How your brand appears in the app"
            class="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)]
                   bg-white dark:bg-slate-800 text-body text-slate-800 dark:text-slate-200
                   focus:outline-none focus:border-primary-500 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div class="flex gap-3">
          <GlassButton variant="secondary" size="lg" icon-left="lucide:arrow-left" @click="$router.push('/onboarding')">
            Back
          </GlassButton>
          <GlassButton variant="primary" size="lg" icon-right="lucide:arrow-right" class="flex-1 justify-center" @click="$router.push('/onboarding/invite')">
            Continue
          </GlassButton>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'], layout: false })

const displayName = ref('')
const brandColor  = ref('#1C6EF2')
const logoPreview = ref<string | null>(null)
const fileInput   = ref<HTMLInputElement | null>(null)

const presetColours = ['#1C6EF2', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2', '#374151']

function triggerUpload() { fileInput.value?.click() }

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { logoPreview.value = ev.target?.result as string }
  reader.readAsDataURL(file)
}
</script>
