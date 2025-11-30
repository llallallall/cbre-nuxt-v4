import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = query.id as string;

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'SubSector ID is required.' });
    }

    try {
        const [deletedSubSector] = await db.delete(schema.subSector)
            .where(eq(schema.subSector.id, id))
            .returning();

        return { message: 'SubSector deleted successfully.', id: deletedSubSector?.id };
    } catch (error: any) {
        console.error('Delete SubSector Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to delete subsector.', data: error.message });
    }
});
