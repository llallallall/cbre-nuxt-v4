// https://nuxt.com/docs/api/configuration/nuxt-config
// Trigger rebuild for hydration fix - 2025-12-05
import tailwindcss from '@tailwindcss/vite'

// Force Restart
export default defineNuxtConfig({
  // ssr: false, // Disable SSR to avoid 500 errors with mapbox
  srcDir: 'app',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      meta: [
        // 기본 메타 태그
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CBRE Korea - Property Management System' },
        { property: 'og:title', content: 'CBRE Korea - Property Management System' },
        { property: 'og:description', content: 'CBRE Korea - Property Management System' },
        // **카카오톡 미리보기를 위한 핵심 설정**
        { property: 'og:image', content: 'https://cbre-pms.devowls.kr/images/logo.jpg' },
        { property: 'og:url', content: 'https://cbre-pms.devowls.kr' },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [// 보안 모듈 (가장 먼저 로드 권장)
    'nuxt-security', '@nuxt/icon', '@nuxt/image', // 인증 모듈 (Lightweight)
    '@nuxt/eslint', 'nuxt-auth-utils', // 'nuxt-mapbox',
    '@nuxt/fonts', "@nuxt/ui", "@nuxtjs/device", "@nuxt/scripts", "@nuxtjs/i18n", "@pinia/nuxt", 'nuxt-mapbox'],

  // [Image Optimization]
  image: {
    domains: ['minio-api.devowls.kr', 'placehold.co']
  },

  // [다국어] i18n 설정 추가
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'ko',
        name: '한국어',
        file: 'ko.json'
      }
    ],
    langDir: '../i18n/locales', // 언어 파일 위치 (/locales/ko.json)
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    strategy: 'prefix_except_default', // 기본 언어는 URL 프리픽스 없음 (/), 그 외는 추가 (/en)
  },

  // [보안] Nuxt Security 세부 설정
  security: {
    headers: {
      // CORS 및 임베딩 정책: 개발 환경에서는 완화
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',

      // CSP (Content Security Policy): 외부 리소스 허용 규칙
      contentSecurityPolicy: {
        "default-src": ["'self'", "data:", "blob:"], // 기본 정책 허용
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://minio-api.devowls.kr", // MinIO 이미지 허용
          "https://*.mapbox.com",         // Mapbox 타일/이미지 허용 (미리 정의)
          "https://placehold.co",          // Placeholder 이미지 허용
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.google.com"
        ],
        "script-src": [
          "'self'",
          "'unsafe-eval'",                // Vite Dev Server 필수
          "'unsafe-inline'",              // 하이드레이션 스크립트 허용
          "blob:",                        // Mapbox/Workers 허용
          "https://*.mapbox.com",          // Mapbox 스크립트 허용
          "https://*.googleapis.com",
          "https://*.google.com",
          "https://*.gstatic.com"
        ],
        "connect-src": [
          "'self'",
          "data:",                        // Data URI 허용 (추가)
          "blob:",                        // Mapbox/Workers 허용
          "https://*.mapbox.com",         // Mapbox API 통신 허용
          "https://api.mapbox.com",         // Mapbox API 통신 허용
          "https://events.mapbox.com",
          "https://api.iconify.design",   // Iconify API 허용
          "https://api.nuxt.com",          // Nuxt API 허용
          "https://dapi.kakao.com",       // Kakao API 허용
          "https://*.googleapis.com",
          "https://*.google.com",
          "https://*.gstatic.com"
        ],
        "worker-src": ["'self'", "blob:"], // Web Worker 허용
        "child-src": ["'self'", "blob:", "https://*.google.com", "https://*.googleapis.com"],
        "frame-src": ["'self'", "https://*.google.com", "https://*.googleapis.com"]
      },
      permissionsPolicy: {
        geolocation: ["self"],
      }
    },
    // CSRF 공격 방지 (POST 요청 시 토큰 검증) - 로그인 문제로 임시 비활성화
    csrf: false,

    // 요청 속도 제한 (DDoS 방지, 1분당 150회)
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 'minute',
      throwError: false, // 사용자 경험을 위해 에러 대신 경고 (운영 시 true 고려)
    },
    sri: false,
  },

  routeRules: {
    '/api/auth/login': {
      security: {
        csrf: false
      }
    }
  },

  // 런타임 환경 변수 
  runtimeConfig: {
    MINIO_SERVER_URL: process.env.MINIO_SERVER_URL,
    MINIO_SERVER_PORT: Number(process.env.MINIO_SERVER_PORT) || 9000,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,

    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    authSecret: process.env.AUTH_SECRET,

    public: {
      githubClientID: process.env.GITHUB_CLIENT_ID,
      googleApiToken: process.env.GOOGLE_API_TOKEN,
      kakaoLocalApiToken: process.env.KAKAO_LOCAL_API_TOKEN,
      minioUrl: process.env.NUXT_PUBLIC_MINIO_URL,
    },
  },

  mapbox: {
    accessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN || '',
  },

  // Tailwind CSS가 이 파일을 엔트리로 사용합니다.
  css: [
    '~/assets/css/cbre-fonts.css',
    '~/assets/css/main.css',
  ],

  // @nuxt/fonts 설정 (로컬 파일 최적화 활성화)
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
  },

  // Nuxt UI 설정
  ui: {
    //color: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'cbre-green']
  },

  // 다크 모드 비활성화 (시스템 설정 무시하고 라이트 모드 고정)
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  }
})