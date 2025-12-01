import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => loginSchema.parse(body));

    // 사용자 조회
    const user = await db.query.user.findFirst({
        where: eq(schema.user.email, body.email)
    });

    if (!user || !user.hashedPassword) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    // 비밀번호 검증
    const isValid = await verifyPassword(user.hashedPassword, body.password);

    if (!isValid) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    // 세션 설정 (nuxt-auth-utils)
    await setUserSession(event, {
        user: {
            id: user.id,
            email: user.email!,
            name: user.name,
            role: user.role!,
            image: user.image || undefined
        }
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }
    };
});
