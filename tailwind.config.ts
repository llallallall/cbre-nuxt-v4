import type { Config } from 'tailwindcss'

export default <Config>{
    // Nuxt 4 구조에 맞춰 스캔할 파일 경로 지정
    content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './app/components/**/*.{vue,js,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue',
        './nuxt.config.{js,ts}',
        './app/app.config.ts',
    ],
    safelist: [
        {
            pattern: /(bg|text|ring|border)-white/,
            variants: ['hover', 'focus', 'active']
        }
    ],
    theme: {
        container: {
            center: true,
            padding: '1.5rem',
        },
        extend: {
            screens: {
                '4xs': '320px',
                '3xs': '375px',
                '2xs': '425px',
                'xs': '480px',
            },
            colors: {
                // Nuxt UI Primary Alias (Linked to Brand Palette)
                primary: {
                    50: 'var(--eds-color-green-50)',
                    100: 'var(--eds-color-green-100)',
                    200: 'var(--eds-color-green-200)',
                    300: 'var(--eds-color-green-300)',
                    400: 'var(--eds-color-green-400)',
                    500: 'var(--eds-color-green-500)', // Brand (Deep Teal)
                    600: 'var(--eds-color-green-600)',
                    700: 'var(--eds-color-green-700)',
                    800: 'var(--eds-color-green-800)',
                    900: 'var(--eds-color-green-900)',
                    950: 'var(--eds-color-green-950)',
                    DEFAULT: 'var(--eds-color-green-brand)',
                },
                accent: 'var(--eds-color-accent)', // Mountain Meadow

                // CBRE Brand Palette (Source of Truth)
                cbre: {
                    green: {
                        50: 'var(--eds-color-green-50)',
                        100: 'var(--eds-color-green-100)',
                        200: 'var(--eds-color-green-200)',
                        300: 'var(--eds-color-green-300)',
                        400: 'var(--eds-color-green-400)',
                        500: 'var(--eds-color-green-500)', // Brand
                        600: 'var(--eds-color-green-600)',
                        700: 'var(--eds-color-green-700)',
                        800: 'var(--eds-color-green-800)',
                        900: 'var(--eds-color-green-900)',
                        950: 'var(--eds-color-green-950)',
                        DEFAULT: 'var(--eds-color-green-brand)',
                        light: 'var(--eds-color-accent)', // Semantic alias for accent usage
                        dark: 'var(--eds-color-green-900)', // Map legacy dark to 900
                    },

                    slate: {
                        DEFAULT: 'var(--eds-color-primary-4)',
                        light: 'var(--eds-color-primary-5)',
                        lighter: 'var(--eds-color-primary-6)',
                    },

                    blue: {
                        dark: 'var(--eds-color-secondary-1)',
                        DEFAULT: 'var(--eds-color-secondary-2)',
                    },
                    teal: 'var(--eds-color-secondary-3)',
                    yellow: 'var(--eds-color-secondary-4)',
                    olive: 'var(--eds-color-secondary-5)',

                    pastel: {
                        blue: 'var(--eds-color-secondary-light-1)',
                        gray: 'var(--eds-color-secondary-light-2)',
                        mint: 'var(--eds-color-secondary-light-3)',
                        cream: 'var(--eds-color-secondary-light-4)',
                        green: 'var(--eds-color-secondary-light-5)',
                    },


                    kakao: 'var(--eds-color-kakao)',
                    tag: 'var(--eds-color-tag)',
                    darkgreen: 'var(--eds-color-darkgreen)',

                    gray: {
                        900: 'var(--eds-color-system-2)',
                        800: 'var(--eds-color-system-3)',
                        700: 'var(--eds-color-system-4)',
                        600: 'var(--eds-color-system-5)',
                        500: 'var(--eds-color-system-6)',
                        400: 'var(--eds-color-system-7)',
                        300: 'var(--eds-color-system-8)',
                        200: 'var(--eds-color-system-9)',
                        100: 'var(--eds-color-system-10)',
                        50: '#F5F5F5',
                    },

                    functional: {
                        error: 'var(--eds-color-system-12)', // #E81717
                        warning: 'var(--eds-color-system-13)', // #F1D230
                        info: 'var(--eds-color-system-14)', // #E6EAEA
                    },

                    system: {
                        12: 'var(--eds-color-system-12)',
                        13: 'var(--eds-color-system-13)',
                        14: 'var(--eds-color-system-14)',
                    }
                },
            },
            fontSize: {
                // Base 1rem = 10px (html 62.5%)
                '2xs': ['1.0rem', { lineHeight: '1.2' }],   // 10px
                'xs': ['1.2rem', { lineHeight: '1.4' }],    // 12px
                'sm': ['1.4rem', { lineHeight: '1.5' }],    // 14px
                'base': ['1.6rem', { lineHeight: '1.6' }],  // 16px
                'lg': ['1.8rem', { lineHeight: '1.6' }],    // 18px
                'xl': ['2.0rem', { lineHeight: '1.4' }],    // 20px
                '2xl': ['2.4rem', { lineHeight: '1.3' }],   // 24px
                '3xl': ['3.0rem', { lineHeight: '1.2' }],   // 30px
                '4xl': ['3.6rem', { lineHeight: '1.1' }],   // 36px
                '5xl': ['4.8rem', { lineHeight: '1.1' }],   // 48px
                '6xl': ['6.0rem', { lineHeight: '1.0' }],   // 60px
                '7xl': ['7.2rem', { lineHeight: '1.0' }],   // 72px
                '8xl': ['9.6rem', { lineHeight: '1.0' }],   // 96px
                '9xl': ['12.8rem', { lineHeight: '1.0' }],  // 128px

                // Custom Display Aliases (Keep existing if needed, but mapped to new scale)
                'hero-mobile': ['5.0rem', { lineHeight: '1.0' }],
                'hero-desktop': ['9.6rem', { lineHeight: '1.0' }],
                'h1-mobile': ['3.0rem', { lineHeight: '1.1' }],
                'h1-desktop': ['4.8rem', { lineHeight: '1.1' }],
                'h2-mobile': ['2.25rem', { lineHeight: '1.2' }], // 22.5px
                'h2-desktop': ['3.2rem', { lineHeight: '1.2' }],
            },
            fontFamily: {
                condensed: ['"Barlow Condensed"', '"Do Hyeon"', 'sans-serif'],
                calibre: ['Calibre', '"Asta Sans"', 'sans-serif'],
                financier: ['Financier', '"Gowun Batang"', 'serif'],
                mono: ['"Space Mono"', '"Orbit"', 'monospace'],
            },
            borderRadius: {
                'none': '0px',
                'cbre': '0px',
            },
            animation: {
                slideHideToRight: 'slideHideToRight 0.5s ease-in-out forwards',
                slideShowFromRight: 'slideShowFromRight 0.5s ease-in-out forwards',
                slideHideToTop: 'slideHideToTop 0.5s ease-in-out forwards',
                slideShowFromTop: 'slideShowFromTop 0.5s ease-in-out forwards',
                slideInRight: 'slideInRight 0.5s ease-in-out forwards',
                slideOutRight: 'slideOutRight 0.5s ease-in-out forwards',
            },
            keyframes: {
                slideHideToRight: {
                    '0%': { right: '0px' },
                    '100%': { right: '-400px' },
                },
                slideShowFromRight: {
                    '0%': { right: '-400px' },
                    '100%': { right: '0px' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideOutRight: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                slideHideToTop: {
                    '0%': {
                        top: '80px',
                        opacity: '1',
                    },
                    '100%': {
                        top: '-1000px',
                        opacity: '0',
                    },
                },
                slideShowFromTop: {
                    '0%': {
                        top: '-1000px',
                        opacity: '0',
                    },
                    '100%': {
                        top: '80px',
                        opacity: '1',
                    },
                },
            },
        },
    },
    plugins: [],
}