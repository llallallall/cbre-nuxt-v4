import { db, schema } from '~~/server/db/db';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const result = await db.select({
            id: schema.sector.id,
            name: schema.sector.name,
        })
            .from(schema.sector)
            .orderBy(asc(schema.sector.name));

        return result;

    } catch (error: any) {
        console.error('Get Sector Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch sectors.',
            data: error.message
        });
    }
});
