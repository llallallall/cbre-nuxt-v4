import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

import { z } from 'zod';

const updateSectorSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    name: z.string().min(1, 'Name is required'),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => updateSectorSchema.parse(body));

    try {
        const [updatedSector] = await db.update(schema.sector)
            .set({ name: body.name })
            .where(eq(schema.sector.id, body.id))
            .returning();

        if (!updatedSector) {
            throw createError({ statusCode: 404, statusMessage: 'Sector not found.' });
        }

        return updatedSector;
    } catch (error: any) {
        console.error('Update Sector Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update sector.', data: error.message });
    }
});
