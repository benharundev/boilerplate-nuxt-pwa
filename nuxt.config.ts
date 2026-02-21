// nuxt.config.ts — Enterprise Nuxt 4 PWA Configuration
export default defineNuxtConfig({
    compatibilityDate: '2025-11-01',

    future: {
        compatibilityVersion: 4,
    },

    // ─── Modules ────────────────────────────────────────────────────────────────
    modules: [
        '@vite-pwa/nuxt',
        '@nuxtjs/tailwindcss',
        '@vueuse/motion/nuxt',
        '@nuxt/icon',
        '@nuxt/fonts',
        '@nuxt/image',
    ],

    // ─── Global CSS ─────────────────────────────────────────────────────────────
    css: ['~/assets/css/main.css'],

    // ─── App Head ───────────────────────────────────────────────────────────────
    app: {
        head: {
            title: 'Enterprise Dashboard — Nuxt 4 PWA',
            titleTemplate: '%s | Enterprise',
            htmlAttrs: { lang: 'en' },
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, viewport-fit=cover',
                },
                {
                    name: 'description',
                    content: 'Enterprise-grade Nuxt 4 PWA with Apple-Material hybrid design system',
                },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
                { name: 'mobile-web-app-capable', content: 'yes' },
                { name: 'theme-color', content: '#0F172A' },
                { name: 'msapplication-TileColor', content: '#0F172A' },
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: 'Enterprise Dashboard' },
                { property: 'og:description', content: 'Enterprise-grade Nuxt 4 PWA' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/icons/icon.svg' },
                { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
                // iOS Splash Screens
                {
                    rel: 'apple-touch-startup-image',
                    media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
                    href: '/splash/iphone-14-pro-max.png',
                },
                {
                    rel: 'apple-touch-startup-image',
                    media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
                    href: '/splash/iphone-14-pro.png',
                },
                {
                    rel: 'apple-touch-startup-image',
                    media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2)',
                    href: '/splash/ipad-air.png',
                },
            ],
        },
        pageTransition: { name: 'page', mode: 'out-in' },
        layoutTransition: { name: 'layout', mode: 'out-in' },
    },

    // ─── Fonts ──────────────────────────────────────────────────────────────────
    fonts: {
        families: [
            { name: 'Inter', weights: ['300', '400', '500', '600', '700', '800'] },
            { name: 'JetBrains Mono', weights: ['400', '500'] },
        ],
    },

    // ─── PWA ────────────────────────────────────────────────────────────────────
    pwa: {
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
            name: 'Enterprise Dashboard',
            short_name: 'Enterprise',
            description: 'Enterprise-grade Nuxt 4 Progressive Web Application',
            theme_color: '#0F172A',
            background_color: '#0F172A',
            display: 'standalone',
            orientation: 'any',
            scope: '/',
            start_url: '/',
            categories: ['business', 'productivity'],
            icons: [
                {
                    src: '/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: '/icons/icon-512-maskable.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                },
            ],
            shortcuts: [
                {
                    name: 'Dashboard',
                    short_name: 'Dashboard',
                    description: 'Open the main dashboard',
                    url: '/',
                    icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
                },
                {
                    name: 'Analytics',
                    short_name: 'Analytics',
                    description: 'View analytics',
                    url: '/explore',
                    icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
                },
            ],
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-cache',
                        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                    },
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'gstatic-fonts-cache',
                        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                    },
                },
            ],
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 3600,
        },
        devOptions: {
            enabled: true,
            type: 'module',
        },
    },

    // ─── Tailwind ─────────────────────────────────────────────────────────────
    tailwindcss: {
        configPath: 'tailwind.config.ts',
        exposeConfig: false,
    },

    // ─── Vite ─────────────────────────────────────────────────────────────────
    vite: {
        css: {
            preprocessorOptions: {},
        },
        optimizeDeps: {
            include: ['lucide-vue-next', '@vueuse/core'],
        },
    },

    // ─── TypeScript ─────────────────────────────────────────────────────────────
    typescript: {
        strict: true,
        typeCheck: false,
    },

    // ─── Dev ────────────────────────────────────────────────────────────────────
    devtools: {
        enabled: true,
    },
})
