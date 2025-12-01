import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { ProfileType } from '~/types/user.type';

interface CreateProfilePayload {
    userId: string;
    imageUrl?: string | null;
    company?: string | null;
    branch?: string | null;
    department?: string | null;
    title?: string | null;
    useProfileImage?: boolean;
}

import { z } from 'zod';

const createProfileSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    imageUrl: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    branch: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    useProfileImage: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => createProfileSchema.parse(body));

    try {
        const existingProfile = await db.query.profile.findFirst({
            where: eq(schema.profile.userId, body.userId)
        });

        if (existingProfile) {
            throw createError({ statusCode: 409, statusMessage: 'Profile already exists for this user.' });
        }

        const [newProfile] = await db.insert(schema.profile).values({
            id: crypto.randomUUID(),
            userId: body.userId,
            imageUrl: body.imageUrl,
            company: body.company,
            branch: body.branch,
            department: body.department,
            title: body.title,
            useProfileImage: body.useProfileImage ?? false,
        }).returning();

        if (!newProfile) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create profile',
            });
        }

        return {
            id: newProfile.id,
            userId: newProfile.userId,
            imageUrl: newProfile.imageUrl,
            company: newProfile.company,
            branch: newProfile.branch,
            department: newProfile.department,
            title: newProfile.title,
            useProfileImage: newProfile.useProfileImage,
        } as ProfileType;

    } catch (error: any) {
        console.error('Create Profile Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create profile.', data: error.message });
    }
});
