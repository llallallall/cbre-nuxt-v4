import { db, schema } from '~~/server/db/db';
import { z } from 'zod';

const createPropertySchema = z.object({
    name: z.string().min(1, 'Property Name is required'),
    sectorId: z.string().min(1, 'Sector is required'),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => createPropertySchema.parse(body));

    try {
        const [newProperty] = await db.insert(schema.property).values({
            id: crypto.randomUUID(),
            name: body.name,
            sectorId: body.sectorId,
            // 나머지 필드는 default 값 또는 null로 생성됨
        }).returning({
            id: schema.property.id
        });

        if (!newProperty) {
            throw createError({ statusCode: 500, statusMessage: 'Failed to create property record.' });
        }

        return { id: newProperty.id };

    } catch (error: any) {
        console.error('Property Create Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create property.' });
    }
});
