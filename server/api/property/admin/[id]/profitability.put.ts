import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { ProfitabilityType } from '~/types/property.type';

import { z } from 'zod';

const profitabilitySchema = z.object({
    profitability: z.object({
        grade: z.string().nullable().optional(),
        effectiveRatio: z.number().nullable().optional(),
    })
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => profitabilitySchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    const data = body.profitability;

    try {
        const [updated] = await db.insert(schema.profitability).values({
            id: crypto.randomUUID(),
            propertyId: propertyId,
            grade: data.grade,
            effectiveRatio: data.effectiveRatio,
        })
            .onConflictDoUpdate({
                target: schema.profitability.propertyId,
                set: {
                    grade: data.grade,
                    effectiveRatio: data.effectiveRatio,
                }
            })
            .returning();

        if (!updated) {
            throw new Error('Failed to upsert profitability data');
        }

        return {
            grade: updated.grade,
            effectiveRatio: updated.effectiveRatio,
        };

    } catch (e: any) {
        console.error('Profitability Update Error:', e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update profitability info.',
            data: e.message
        });
    }
});
