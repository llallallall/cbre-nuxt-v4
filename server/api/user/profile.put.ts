import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { ProfileType } from '~/types/user.type';

import { z } from 'zod';

const updateProfileSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    imageUrl: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    branch: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    useProfileImage: z.boolean().optional(),
    name: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional()
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => updateProfileSchema.parse(body));

    if (!body.userId) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
    }

    try {
        // Update User table (name & password)
        const userUpdateData: any = {};
        if (body.name) userUpdateData.name = body.name;
        if (body.password) {
            userUpdateData.hashedPassword = await hashPassword(body.password);
        }

        if (Object.keys(userUpdateData).length > 0) {
            await db.update(schema.user)
                .set(userUpdateData)
                .where(eq(schema.user.id, body.userId));
        }

        // Upsert Profile
        const [updatedProfile] = await db.insert(schema.profile)
            .values({
                id: crypto.randomUUID(),
                userId: body.userId,
                imageUrl: body.imageUrl,
                company: body.company,
                branch: body.branch,
                department: body.department,
                title: body.title,
                useProfileImage: body.useProfileImage ?? false,
            })
            .onConflictDoUpdate({
                target: schema.profile.userId,
                set: {
                    imageUrl: body.imageUrl,
                    company: body.company,
                    branch: body.branch,
                    department: body.department,
                    title: body.title,
                    useProfileImage: body.useProfileImage,
                    updatedAt: new Date().toISOString(),
                }
            })
            .returning();

        if (!updatedProfile) {
            throw createError({ statusCode: 500, statusMessage: 'Failed to upsert profile.' });
        }

        return {
            id: updatedProfile.id,
            userId: updatedProfile.userId,
            imageUrl: updatedProfile.imageUrl,
            company: updatedProfile.company,
            branch: updatedProfile.branch,
            department: updatedProfile.department,
            title: updatedProfile.title,
            useProfileImage: updatedProfile.useProfileImage,
            name: body.name // Return updated name
        } as ProfileType & { name?: string };

    } catch (error: any) {
        console.error('Update Profile Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update profile.', data: error.message });
    }
});
