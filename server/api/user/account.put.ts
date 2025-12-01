import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

import { z } from 'zod';

const updateAccountSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    name: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => updateAccountSchema.parse(body));

    const updateData: any = {};

    if (body.name) {
        updateData.name = body.name;
    }

    if (body.password) {
        updateData.hashedPassword = await hashPassword(body.password);
    }

    if (Object.keys(updateData).length === 0) {
        return { message: 'No changes provided.' };
    }

    try {
        const [updatedUser] = await db.update(schema.user)
            .set(updateData)
            .where(eq(schema.user.id, body.userId))
            .returning({
                id: schema.user.id,
                name: schema.user.name,
                email: schema.user.email,
            });

        return {
            status: 'success',
            data: updatedUser
        };

    } catch (error: any) {
        console.error('Update Account Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update account info.',
            data: error.message
        });
    }
});
