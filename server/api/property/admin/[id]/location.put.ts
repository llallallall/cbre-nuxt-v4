import { db, schema } from '~~/server/db/db';
import type { LocationType } from '~/types/property.type';

import { z } from 'zod';

const locationSchema = z.object({
    addressFull: z.string().nullable().optional(),
    addressFullJibun: z.string().nullable().optional(),
    addressProvince: z.string().nullable().optional(),
    addressCity: z.string().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    const body = await readValidatedBody(event, (body) => locationSchema.parse(body));

    try {
        const [updated] = await db.insert(schema.location).values({
            id: crypto.randomUUID(),
            propertyId: propertyId,
            addressFull: body.addressFull,
            addressFullJibun: body.addressFullJibun,
            addressProvince: body.addressProvince,
            addressCity: body.addressCity,
            latitude: body.latitude,
            longitude: body.longitude,
        })
            .onConflictDoUpdate({
                target: schema.location.propertyId,
                set: {
                    addressFull: body.addressFull,
                    addressFullJibun: body.addressFullJibun,
                    addressProvince: body.addressProvince,
                    addressCity: body.addressCity,
                    latitude: body.latitude,
                    longitude: body.longitude,
                }
            })
            .returning();

        if (!updated) {
            throw new Error('Failed to upsert location data');
        }

        return {
            id: updated.id,
            propertyId: updated.propertyId,
            addressFull: updated.addressFull,
            addressFullJibun: updated.addressFullJibun,
            addressProvince: updated.addressProvince,
            addressCity: updated.addressCity,
            latitude: updated.latitude,
            longitude: updated.longitude,
        };

    } catch (e: any) {
        console.error('Location Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update location.' });
    }
});
