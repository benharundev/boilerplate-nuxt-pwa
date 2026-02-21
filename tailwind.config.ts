import type { Config } from 'tailwindcss'

export default {
    darkMode: 'class',

    content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './nuxt.config.ts',
    ],

    theme: {
        // ─── Apple-specific responsive breakpoints ────────────────────────────
        screens: {
            'xs': '390px',   // iPhone 14 Pro portrait
            'sm': '640px',   // Small landscape / large phone
            'md': '744px',   // iPad mini portrait (Tablet threshold)
            'lg': '1024px',  // iPad Pro landscape / small desktop
            'xl': '1280px',  // Standard desktop
            '2xl': '1440px',  // Wide-screen desktop
            '3xl': '1920px',  // Ultra-wide
        },

        extend: {
            // ─── Font Stacks ────────────────────────────────────────────────────
            fontFamily: {
                sans: [
                    '"Inter"',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Display"',
                    '"SF Pro Text"',
                    'system-ui',
                    'sans-serif',
                ],
                mono: [
                    '"JetBrains Mono"',
                    '"SF Mono"',
                    'ui-monospace',
                    'Menlo',
                    'monospace',
                ],
            },

            // ─── Enterprise Color Palette ────────────────────────────────────────
            colors: {
                // Corporate Blue — primary brand
                primary: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#1C6EF2',   // ← Brand blue
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                    950: '#172554',
                },
                // Enterprise slate neutrals
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#020617',
                },
                // Semantic tokens
                success: {
                    DEFAULT: '#10B981',
                    light: '#D1FAE5',
                    dark: '#065F46',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#FEF3C7',
                    dark: '#92400E',
                },
                danger: {
                    DEFAULT: '#EF4444',
                    light: '#FEE2E2',
                    dark: '#7F1D1D',
                },
                info: {
                    DEFAULT: '#0EA5E9',
                    light: '#E0F2FE',
                    dark: '#0C4A6E',
                },
            },

            // ─── HIG-compliant Border Radius ─────────────────────────────────────
            borderRadius: {
                'sm': '6px',
                'md': '10px',
                'lg': '14px',
                'xl': '18px',
                '2xl': '22px',
                '3xl': '28px',
                '4xl': '36px',
                'pill': '9999px',
            },

            // ─── Depth-aware Box Shadows ─────────────────────────────────────────
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.15)',
                'glass-lg': '0 20px 60px rgba(0,0,0,.16), 0 8px 24px rgba(0,0,0,.08)',
                'glass-dark': '0 8px 32px 0 rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.06)',
                'card': '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)',
                'card-hover': '0 4px 24px rgba(0,0,0,.10), 0 1px 4px rgba(0,0,0,.05)',
                'fab': '0 8px 24px rgba(28,110,242,.40)',
                'fab-hover': '0 12px 32px rgba(28,110,242,.55)',
                'sidebar': '4px 0 32px rgba(0,0,0,.08)',
                'nav': '0 4px 16px rgba(0,0,0,.06)',
                'bottom-bar': '0 -4px 24px rgba(0,0,0,.08)',
                'inset-top': 'inset 0 1px 0 rgba(255,255,255,.08)',
                'inset-card': 'inset 0 1px 0 rgba(255,255,255,.12), inset 0 -1px 0 rgba(0,0,0,.04)',
            },

            // ─── Apple Easing Curves ─────────────────────────────────────────────
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                'spring-soft': 'cubic-bezier(0.25, 1.00, 0.50, 1)',
                'apple': 'cubic-bezier(0.42, 0.00, 0.58, 1.00)',
                'decelerate': 'cubic-bezier(0.00, 0.00, 0.20, 1)',
                'accelerate': 'cubic-bezier(0.40, 0.00, 1.00, 1)',
                'sharp': 'cubic-bezier(0.40, 0.00, 0.60, 1)',
            },

            transitionDuration: {
                '50': '50ms',
                '150': '150ms',
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
                '500': '500ms',
                '600': '600ms',
                '700': '700ms',
                '800': '800ms',
            },

            // ─── Animations ──────────────────────────────────────────────────────
            animation: {
                'shimmer': 'shimmer 2.4s infinite linear',
                'pulse-slow': 'pulse 3.5s cubic-bezier(.4,0,.6,1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'bar-fill': 'barFill 1.2s ease-out forwards',
                'fade-up': 'fadeUp .4s ease-out forwards',
                'slide-in-left': 'slideInLeft .35s ease-out forwards',
                'pop-in': 'popIn .3s cubic-bezier(0.34,1.56,0.64,1) forwards',
            },

            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                glow: {
                    from: { boxShadow: '0 0 12px rgba(28,110,242,.3)' },
                    to: { boxShadow: '0 0 28px rgba(28,110,242,.65)' },
                },
                barFill: {
                    from: { transform: 'scaleX(0)', transformOrigin: 'left' },
                    to: { transform: 'scaleX(1)', transformOrigin: 'left' },
                },
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                popIn: {
                    from: { opacity: '0', transform: 'scale(0.85)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },

            // ─── Backdrop Blur ────────────────────────────────────────────────────
            backdropBlur: {
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'lg': '20px',
                'xl': '30px',
                '2xl': '40px',
                '3xl': '60px',
                '4xl': '80px',
            },

            // ─── Spacing extras ───────────────────────────────────────────────────
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
                '18': '4.5rem',
                '22': '5.5rem',
                '72': '18rem',
                '80': '20rem',
                '88': '22rem',
                '96': '24rem',
            },

            // ─── Z-index ─────────────────────────────────────────────────────────
            zIndex: {
                'nav': '100',
                'modal': '200',
                'toast': '300',
                'overlay': '400',
            },
        },
    },

    plugins: [],
} satisfies Config
