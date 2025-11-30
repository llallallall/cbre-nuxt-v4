import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { AccessibilityType } from '../../../../../app/types/property.type';

import { z } from 'zod';

const accessibilitySchema = z.object({
    distanceToIc: z.string().nullable().optional(),
    timeTakenToCityHall: z.string().nullable().optional(),
    timeTakenToSubway: z.string().nullable().optional(),
    nearbyFacilities: z.string().nullable().optional(),
    nearbyAttractions: z.string().nullable().optional(),
    nearbyPlaces: z.string().nullable().optional(),
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => accessibilitySchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const [updated] = await db.insert(schema.accessibility).values({
            id: uuidv4(),
            propertyId: propertyId,
            distanceToIc: body.distanceToIc,
            timeTakenToCityHall: body.timeTakenToCityHall,
            timeTakenToSubway: body.timeTakenToSubway,
            nearbyFacilities: body.nearbyFacilities,
            nearbyAttractions: body.nearbyAttractions,
            nearbyPlaces: body.nearbyPlaces,
        })
            .onConflictDoUpdate({
                target: schema.accessibility.propertyId,
                set: {
                    distanceToIc: body.distanceToIc,
                    timeTakenToCityHall: body.timeTakenToCityHall,
                    timeTakenToSubway: body.timeTakenToSubway,
                    nearbyFacilities: body.nearbyFacilities,
                    nearbyAttractions: body.nearbyAttractions,
                    nearbyPlaces: body.nearbyPlaces,
                }
            })
            .returning();

        if (!updated) {
            throw new Error('Failed to upsert accessibility data');
        }

        return {
            distanceToIc: updated.distanceToIc,
            timeTakenToCityHall: updated.timeTakenToCityHall,
            timeTakenToSubway: updated.timeTakenToSubway,
            nearbyFacilities: updated.nearbyFacilities,
            nearbyAttractions: updated.nearbyAttractions,
            nearbyPlaces: updated.nearbyPlaces,
        };

    } catch (e: any) {
        console.error('Accessibility Update Error:', e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update accessibility info.',
            data: e.message
        });
    }
});
