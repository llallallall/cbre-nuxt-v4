import { db, schema } from '~~/server/db/db';

import { z } from 'zod';

const createSectorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => createSectorSchema.parse(body));

    try {
        const [newSector] = await db.insert(schema.sector).values({
            id: crypto.randomUUID(),
            name: body.name,
        }).returning();

        return newSector;
    } catch (error: any) {
        console.error('Create Sector Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create sector.', data: error.message });
    }
});
