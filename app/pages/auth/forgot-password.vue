<template>
  <div>
    <NuxtLayout name="auth">
      <template v-if="!sent">
        <div class="mb-8">
          <h2 class="text-title2 font-bold text-slate-900 dark:text-white">Reset password</h2>
          <p class="text-callout text-slate-500 mt-1">We'll send you a link to reset your password.</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
            <div class="relative">
              <Icon name="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input v-model="email" type="email" required placeholder="alex@company.com"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-white/50 dark:bg-slate-800/50
                       text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2
                       focus:ring-primary-500 placeholder:text-slate-400 transition-all" />
            </div>
          </div>

          <GlassButton type="submit" variant="primary" size="lg" :loading="isLoading" class="w-full justify-center">
            Send Reset Link
          </GlassButton>
        </form>
      </template>

      <!-- Success state -->
      <template v-else>
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 400, ease: 'easeOut' } }"
          class="text-center py-4"
        >
          <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Icon name="lucide:mail-check" class="w-8 h-8 text-success" />
          </div>
          <h3 class="text-title3 font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h3>
          <p class="text-callout text-slate-500 mb-6">
            We sent a password reset link to <strong class="text-slate-700 dark:text-slate-200">{{ email }}</strong>
          </p>
          <GlassButton variant="secondary" icon-left="lucide:arrow-left" @click="sent = false">
            Back to login
          </GlassButton>
        </div>
      </template>

      <div class="mt-6 text-center">
        <NuxtLink to="/auth/login" class="text-caption1 text-slate-400 hover:text-primary-600 transition-colors">
          ← Back to sign in
        </NuxtLink>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['guest'], layout: false })

const { forgotPassword } = useAuth()
const email    = ref('')
const sent     = ref(false)
const isLoading = ref(false)

async function handleSubmit() {
  isLoading.value = true
  try {
    await forgotPassword(email.value)
    sent.value = true
  } finally {
    isLoading.value = false
  }
}
</script>
