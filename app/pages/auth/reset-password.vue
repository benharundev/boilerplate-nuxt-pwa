<template>
  <div>
    <NuxtLayout name="auth">
      <!-- Invalid/missing token -->
      <div v-if="!token" class="text-center py-4">
        <div class="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:link-2-off" class="w-8 h-8 text-danger" />
        </div>
        <h3 class="text-title3 font-bold text-slate-900 dark:text-white mb-2">Invalid Reset Link</h3>
        <p class="text-callout text-slate-500 mb-6">This link is expired or invalid. Please request a new one.</p>
        <GlassButton variant="primary" @click="$router.push('/auth/forgot-password')">
          Request New Link
        </GlassButton>
      </div>

      <!-- Success -->
      <div
        v-else-if="success"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 400 } }"
        class="text-center py-4"
      >
        <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:check-circle" class="w-8 h-8 text-success" />
        </div>
        <h3 class="text-title3 font-bold text-slate-900 dark:text-white mb-2">Password Updated</h3>
        <p class="text-callout text-slate-500 mb-6">Your password has been reset successfully.</p>
        <GlassButton variant="primary" @click="$router.push('/auth/login')">
          Sign In Now
        </GlassButton>
      </div>

      <!-- Reset form -->
      <template v-else>
        <div class="mb-8">
          <h2 class="text-title2 font-bold text-slate-900 dark:text-white">Set New Password</h2>
          <p class="text-callout text-slate-500 mt-1">Choose a strong password for your account.</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
            <div class="relative">
              <Icon name="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="password"
                :type="showPw ? 'text' : 'password'"
                required
                placeholder="Min. 8 characters"
                class="w-full pl-10 pr-12 py-3 rounded-xl border border-[var(--color-border)]
                       bg-white/50 dark:bg-slate-800/50 text-callout text-slate-800 dark:text-slate-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 touch-target text-slate-400" @click="showPw = !showPw">
                <Icon :name="showPw ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
              </button>
            </div>
            <!-- Strength bar -->
            <div class="flex gap-1 mt-1.5">
              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-colors"
                :class="strength >= i ? strengthColor : 'bg-slate-200 dark:bg-slate-700'" />
            </div>
          </div>

          <div>
            <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <div class="relative">
              <Icon name="lucide:lock-check" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="confirm"
                :type="showPw ? 'text' : 'password'"
                required
                placeholder="Repeat your password"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)]
                       bg-white/50 dark:bg-slate-800/50 text-callout text-slate-800 dark:text-slate-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all"
                :class="confirm && password !== confirm ? 'border-danger focus:ring-danger' : ''"
              />
            </div>
            <p v-if="confirm && password !== confirm" class="text-caption2 text-danger mt-1">Passwords do not match</p>
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full justify-center mt-2"
            :loading="isLoading"
            :disabled="password !== confirm || strength < 2"
          >
            Reset Password
          </GlassButton>
        </form>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['guest'], layout: false })

const route  = useRoute()
const { resetPassword } = useAuth()

const token  = computed(() => route.query.token as string | undefined)
const password = ref('')
const confirm  = ref('')
const showPw   = ref(false)
const isLoading = ref(false)
const success   = ref(false)

const strength = computed(() => {
  let s = 0
  if (password.value.length >= 8) s++
  if (/[A-Z]/.test(password.value)) s++
  if (/[0-9]/.test(password.value)) s++
  if (/[^A-Za-z0-9]/.test(password.value)) s++
  return s
})
const strengthColor = computed(() => {
  if (strength.value <= 1) return 'bg-danger'
  if (strength.value === 2) return 'bg-warning'
  if (strength.value === 3) return 'bg-info'
  return 'bg-success'
})

async function handleSubmit() {
  if (password.value !== confirm.value || !token.value) return
  isLoading.value = true
  try {
    await resetPassword(token.value, password.value)
    success.value = true
  } finally {
    isLoading.value = false
  }
}
</script>
