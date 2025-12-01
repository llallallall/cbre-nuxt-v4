import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { HistoryType } from '~/types/property.type';

import { z } from 'zod';

const historySchema = z.array(z.object({
    year: z.string(),
    type: z.enum(['COMPLETION', 'RENOVATION']),
}));

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => historySchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        await db.transaction(async (tx) => {
            // 1. 기존 데이터 삭제
            await tx.delete(schema.history).where(eq(schema.history.propertyId, propertyId));

            // 2. 새 데이터 생성
            if (body && body.length > 0) {
                await tx.insert(schema.history).values(
                    body.map(h => ({
                        id: crypto.randomUUID(),
                        propertyId: propertyId,
                        year: h.year,
                        type: h.type,
                    }))
                );
            }
        });

        // 3. 최신 데이터 조회 및 반환
        const updatedHistories = await db.query.history.findMany({
            where: eq(schema.history.propertyId, propertyId),
            orderBy: (histories, { asc }) => [asc(histories.year)]
        });

        return updatedHistories.map(h => ({
            id: h.id,
            year: h.year,
            type: h.type,
        }));

    } catch (e: any) {
        console.error('History Update Error:', e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update history.',
            data: e.message
        });
    }
});
