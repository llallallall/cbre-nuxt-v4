import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { SaleCreatePayload } from '../../../../../../app/types/property.type';
import { mapSaleDetailFromClientToDrizzle, toDateOrNull } from '~~/server/utils/transactionMapper';

import { z } from 'zod';

const saleUpdateSchema = z.object({
    year: z.string().min(1, 'Year is required'),
    quarter: z.string().min(1, 'Quarter is required'),
    executionDate: z.string().or(z.date()),
    saleType: z.enum(['ENBLOC', 'PARTIAL']),
    gfaSqm: z.number().nullable().optional(),
    nfaSqm: z.number().nullable().optional(),
    priceKrw: z.number().nullable().optional(),
    pricePerGfa: z.number().nullable().optional(),
    pricePerNfa: z.number().nullable().optional(),
    estCapRate: z.number().nullable().optional(),
    estDiscountRate: z.number().nullable().optional(),
    buyer: z.string().nullable().optional(),
    seller: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
});

export default defineEventHandler(async (event) => {
    const { transactionId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => saleUpdateSchema.parse(body));

    if (!transactionId) {
        throw createError({ statusCode: 400, statusMessage: 'Transaction ID is required.' });
    }

    try {
        await db.transaction(async (tx) => {
            // 1. Transaction 업데이트
            await tx.update(schema.transaction)
                .set({
                    year: body.year,
                    quarter: body.quarter,
                    executionDate: toDateOrNull(body.executionDate)!,
                })
                .where(eq(schema.transaction.id, transactionId));

            // 2. Sale 상세 정보 업데이트
            await tx.update(schema.sale)
                .set(mapSaleDetailFromClientToDrizzle(body))
                .where(eq(schema.sale.transactionId, transactionId));
        });

        return { message: 'Success', id: transactionId };

    } catch (error: any) {
        console.error('Sale Update Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update sale.', data: error.message });
    }
});
