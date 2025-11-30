import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

import { z } from 'zod';

const updateSubSectorSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    name: z.string().min(1, 'Name is required'),
    sectorId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => updateSubSectorSchema.parse(body));

    try {
        const [updatedSubSector] = await db.update(schema.subSector)
            .set({
                name: body.name,
                ...(body.sectorId && { sectorId: body.sectorId }),
            })
            .where(eq(schema.subSector.id, body.id))
            .returning();

        if (!updatedSubSector) {
            throw createError({ statusCode: 404, statusMessage: 'SubSector not found.' });
        }

        return {
            id: updatedSubSector.id,
            sectorId: updatedSubSector.sectorId,
            name: updatedSubSector.name
        };
    } catch (error: any) {
        console.error('Update SubSector Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update subsector.', data: error.message });
    }
});
