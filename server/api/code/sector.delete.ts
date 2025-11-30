import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = query.id as string;

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Sector ID is required.' });
    }

    try {
        const [deletedSector] = await db.delete(schema.sector)
            .where(eq(schema.sector.id, id))
            .returning();

        return { message: 'Sector deleted successfully.', id: deletedSector?.id };
    } catch (error: any) {
        console.error('Delete Sector Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to delete sector.', data: error.message });
    }
});
