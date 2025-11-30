import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const userId = query.userId as string;

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
    }

    try {
        const result = await db.delete(schema.profile).where(eq(schema.profile.userId, userId));

        // Drizzle delete doesn't throw if not found, but we can check if we want.
        // But usually idempotent delete is fine.

        return { status: 'success', message: 'Profile deleted successfully.' };

    } catch (error: any) {
        console.error('Delete Profile Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to delete profile.', data: error.message });
    }
});
