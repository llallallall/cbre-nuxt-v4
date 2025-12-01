import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { ProfileType } from '~/types/user.type';

interface UpdateProfilePayload {
    userId: string;
    imageUrl?: string | null;
    company?: string | null;
    branch?: string | null;
    department?: string | null;
    title?: string | null;
    useProfileImage?: boolean;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<UpdateProfilePayload>(event);

    if (!body.userId) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
    }

    try {
        const [updatedProfile] = await db.update(schema.profile)
            .set({
                imageUrl: body.imageUrl,
                company: body.company,
                branch: body.branch,
                department: body.department,
                title: body.title,
                useProfileImage: body.useProfileImage,
            })
            .where(eq(schema.profile.userId, body.userId))
            .returning();

        if (!updatedProfile) {
            throw createError({ statusCode: 404, statusMessage: 'Profile not found.' });
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
        } as ProfileType;

    } catch (error: any) {
        console.error('Update Profile Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update profile.', data: error.message });
    }
});
