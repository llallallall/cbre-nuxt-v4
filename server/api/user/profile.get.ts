import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { UserType } from '~/types/user.type';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const userId = query.id as string;

    if (!userId) {
        return null;
    }

    try {
        const user = await db.query.user.findFirst({
            where: eq(schema.user.id, userId),
            with: {
                profile: true,
            }
        });

        if (!user) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        const response: UserType = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,

            profile: user.profile ? {
                id: user.profile.id,
                userId: user.profile.userId,
                imageUrl: user.profile.imageUrl,
                company: user.profile.company,
                branch: user.profile.branch,
                department: user.profile.department,
                title: user.profile.title,
                useProfileImage: user.profile.useProfileImage
            } : null
        };

        return response;

    } catch (error) {
        console.error('Get User Profile Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user profile' });
    }
});
