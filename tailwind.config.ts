import type { Config } from 'tailwindcss'

export default <Config>{
    // Nuxt 4 구조에 맞춰 스캔할 파일 경로 지정
    content: [
        // 모든 소스 파일은 app 디렉토리 아래에 있습니다.
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './app/components/**/*.{vue,js,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue',
        './nuxt.config.{js,ts}',
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
            // CBRE 브랜드 컬러 팔레트 정의 (여기 정의된 이름이 클래스가 됨)
            colors: {
                // Nuxt UI Primary Color Mapping
                'cbre-green': {
                    50: '#F5F7F7',
                    100: '#E6EBE9',
                    200: '#C2CEC9',
                    300: '#9EB1AA',
                    400: '#54776B',
                    500: '#003F2D', // Main Brand Color
                    600: '#003828',
                    700: '#003224',
                    800: '#002B1F',
                    900: '#00241A',
                    950: '#001D15',
                },
            },
            fontFamily: {
                condensed: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
                calibre: ['Calibre', 'sans-serif'],
                financier: ['Financier', 'serif'],
            },
            // 각진 모서리
            borderRadius: {
                'cbre': '0px',
            },
            animation: {
                slideHideToRight: 'slideHideToRight 0.5s ease-in-out forwards',
                slideShowFromRight: 'slideShowFromRight 0.5s ease-in-out forwards',
                slideHideToTop: 'slideHideToTop 0.5s ease-in-out forwards',
                slideShowFromTop: 'slideShowFromTop 0.5s ease-in-out forwards',
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