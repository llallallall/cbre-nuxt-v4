// server/db/drizzle.ts

// drizzle-orm/pg 대신, 사용 중인 node-postgres 드라이버에 맞춰 임포트
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // 정의한 스키마를 가져옵니다.

// 1. PostgreSQL 연결 풀 설정
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// 2. Drizzle Client 생성 (Singleton 패턴 적용 필요)
// Drizzle Client는 Pool 위에서 작동합니다.
const db = drizzle(pool, {
    schema,
    logger: false // process.env.NODE_ENV === 'development' ? true : false // 개발 환경에서 쿼리 로깅 활성화
});

// HMR 안전 패턴: 개발 환경에서 중복 생성을 방지합니다.
// (Prisma에서 사용하던 패턴을 Drizzle에도 적용하여 안정성을 높입니다.)
declare global {
    var drizzleDb: typeof db | undefined;
}

export const useDb = global.drizzleDb || db;

if (process.env.NODE_ENV !== 'production') {
    global.drizzleDb = useDb;
}