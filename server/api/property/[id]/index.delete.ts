import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        // Postgres FK CASCADE handles deletion of related records
        const [deletedProperty] = await db.delete(schema.property)
            .where(eq(schema.property.id, id))
            .returning();

        if (!deletedProperty) {
            throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
        }

        return {
            status: 'success',
            message: `Property ${id} deleted successfully.`,
            data: deletedProperty
        };

    } catch (error: any) {
        console.error('Property Delete Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete property.',
            data: error.message
        });
    }
});
