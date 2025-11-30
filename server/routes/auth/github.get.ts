import { eq, and } from 'drizzle-orm';
import { db, schema } from '~~/server/db/db';
// Node.js 내장 모듈을 사용하여 UUID 생성 (Nuxt 4/Nitro 환경)
import { randomUUID } from 'node:crypto';

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true,
    },
    async onSuccess(event, { user: ghUser, tokens }) {
        // 1. 기존에 연동된 계정(Account)이 있는지 확인
        // schema.account 테이블 사용
        const existingAccount = await db.query.account.findFirst({
            where: and(
                eq(schema.account.provider, 'github'),
                // providerAccountId는 스키마에서 text 타입이므로 문자열로 변환
                eq(schema.account.providerAccountId, String(ghUser.id))
            ),
            with: { user: true } // 연결된 유저 정보도 함께 가져옴 (schema.ts의 relation 설정 필요)
        });

        let userId: string = '';
        let userRole: string = 'USER';

        if (existingAccount) {
            // 2-A. 이미 가입된 유저라면 로그인 처리
            userId = existingAccount.userId;
            // 기존 유저의 권한 정보를 가져옴 (relation이 연결되어 있다고 가정)
            // 만약 relation 타입 추론이 안 될 경우를 대비해 안전하게 접근
            if (existingAccount.user) {
                userRole = existingAccount.user.role || 'USER';
            }

        } else {
            // 2-B. 가입되지 않은 유저라면 신규 생성 (회원가입) 또는 계정 연결

            // 2-B-1. 이메일 중복 체크
            const existingUserByEmail = await db.query.user.findFirst({
                where: eq(schema.user.email, ghUser.email as string)
            });

            if (existingUserByEmail) {
                // 이미 이메일이 존재하는 경우 해당 유저에 계정 연결
                userId = existingUserByEmail.id;
                userRole = existingUserByEmail.role || 'USER';
            } else {
                // 2-B-2. 신규 유저 생성
                // 스키마의 id가 자동 생성이 아니므로 randomUUID() 사용
                const newUserId = randomUUID();

                await db.insert(schema.user).values({
                    id: newUserId,
                    name: ghUser.name || ghUser.login,
                    email: ghUser.email,
                    image: ghUser.avatar_url,
                    // hashedPassword는 notNull이므로 OAuth 유저를 위한 임의의 값 설정
                    hashedPassword: `oauth:github:${randomUUID()}`,
                    role: 'USER',
                    emailVerified: new Date().toISOString(), // 이메일 인증된 것으로 간주
                });

                userId = newUserId;
            }

            // 2-B-3. 계정(Account) 테이블 연결
            // Account 테이블의 id도 직접 생성해야 함
            await db.insert(schema.account).values({
                id: randomUUID(),
                userId: userId,
                type: 'oauth', // 스키마의 type 컬럼 (notNull)
                provider: 'github',
                providerAccountId: String(ghUser.id),
                accessToken: tokens.access_token,
                // 필요한 경우 토큰 관련 추가 필드 저장
            });
        }

        // 3. 세션 생성 (nuxt-auth-utils)
        // 브라우저 쿠키에 암호화되어 저장됨
        await setUserSession(event, {
            user: {
                id: userId,
                email: ghUser.email,
                name: ghUser.name || ghUser.login,
                avatar: ghUser.avatar_url,
                role: userRole
            }
        });

        // 4. 로그인 성공 후 메인 페이지로 이동
        return sendRedirect(event, '/');
    },

    // 에러 처리
    onError(event, error) {
        console.error('GitHub OAuth Error:', error);
        return sendRedirect(event, '/login?error=github_auth_failed');
    }
});