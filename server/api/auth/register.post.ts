import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => registerSchema.parse(body));

    // 이메일 중복 확인
    const existingUser = await db.query.user.findFirst({
        where: eq(schema.user.email, body.email)
    });

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'User already exists with this email.',
        });
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(body.password);

    try {
        const userId = crypto.randomUUID();

        // 사용자 생성
        const [newUser] = await db.insert(schema.user).values({
            id: userId,
            email: body.email,
            name: body.name,
            hashedPassword: hashedPassword,
            role: 'USER',
        }).returning({
            id: schema.user.id,
            email: schema.user.email,
            name: schema.user.name,
            role: schema.user.role,
        });

        // 프로필 생성
        await db.insert(schema.profile).values({
            id: crypto.randomUUID(),
            userId: userId,
        });

        return newUser;

    } catch (error: any) {
        console.error('Registration Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to create user account.',
        });
    }
});
