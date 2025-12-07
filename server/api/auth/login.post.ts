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

    console.log(`[Login Debug] User lookup for ${body.email}:`, user ? 'Found' : 'Not Found');
    if (user) console.log(`[Login Debug] Stored Hash: ${user.hashedPassword}`);

    if (!user || !user.hashedPassword) {
        console.log('[Login Debug] User not found or no password hash');
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    // 비밀번호 검증
    const isValid = await verifyPassword(user.hashedPassword, body.password);
    console.log(`[Login Debug] Password verify result: ${isValid}`);

    if (!isValid) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    // 세션 설정 (nuxt-auth-utils)
    try {
        console.log('[Login Debug] Attempting to set user session...');
        await setUserSession(event, {
            user: {
                id: user.id,
                email: user.email!,
                name: user.name,
                role: user.role!,
                image: user.image || undefined
            }
        });
        console.log('[Login Debug] Session set successfully');
    } catch (sessionError) {
        console.error('[Login Debug] Failed to set user session:', sessionError);
        throw createError({
            statusCode: 500,
            message: 'Session initialization failed',
        });
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }
    };
});
