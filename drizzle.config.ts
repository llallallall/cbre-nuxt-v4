import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './server/db/schema.ts', // 스키마 파일 위치
    out: './drizzle',                 // 마이그레이션 파일이 저장될 폴더
    dialect: 'postgresql',            // [수정] 사용 DB 종류는 'dialect'로 지정 (PostgreSQL)
    dbCredentials: {
        // .env 파일의 DATABASE_URL을 사용하도록 설정
        url: process.env.DATABASE_URL || '',
    },
    // Nuxt의 루트 디렉토리를 기준으로 설정 파일이 위치하도록 설정
    // 이 설정은 Nuxt/Vite 환경에서 경로를 해석하는 데 도움이 됩니다.
    strict: true,
    verbose: true,
});