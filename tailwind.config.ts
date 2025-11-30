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
                },
            },
            fontFamily: {
                condensed: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
            },
            // 각진 모서리
            borderRadius: {
                'cbre': '0px',
            }
        },
    },
    plugins: [],
}