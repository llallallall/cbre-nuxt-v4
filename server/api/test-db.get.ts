// server/api/test-db.get.ts
import { db, schema } from '~~/server/db/db'; // 통합 Client 임포트
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        // 2. 전체 사용자 수 조회
        const allUsers = await db.select().from(schema.user);


        return {
            status: 'success',
            message: 'Drizzle ORM DB 통신 테스트 성공!',
            totalUsers: allUsers.length,
            // 삽입된 데이터와 전체 사용자 목록은 디버깅 목적으로 로그에만 남깁니다.
        };
    } catch (error) {
        console.error("Drizzle DB 통신 테스트 실패:", error);

        // DB 연결 오류가 발생한 경우, 상세 정보를 브라우저에 노출하지 않고 에러 처리
        const errorMessage = error instanceof Error ? error.message : '연결 또는 쿼리 오류';
        throw createError({
            statusCode: 500,
            message: `DB 통신 테스트 실패: ${errorMessage}`,
        });
    }
});