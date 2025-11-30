import { db, schema } from '~~/server/db/db';
import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod';

const createSubSectorSchema = z.object({
    sectorId: z.string().min(1, 'Sector ID is required'),
    name: z.string().min(1, 'Name is required'),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => createSubSectorSchema.parse(body));

    try {
        const [newSubSector] = await db.insert(schema.subSector).values({
            id: uuidv4(),
            sectorId: body.sectorId,
            name: body.name,
        }).returning();

        if (!newSubSector) {
            throw createError({ statusCode: 500, statusMessage: 'Failed to create subsector.' });
        }

        return {
            id: newSubSector.id,
            sectorId: newSubSector.sectorId,
            name: newSubSector.name
        };
    } catch (error: any) {
        console.error('Create SubSector Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create subsector.', data: error.message });
    }
});
