import { db, schema } from '~~/server/db/db';
import type { SaleCreatePayload } from '~/types/property.type';
import { mapSaleDetailFromClientToDrizzle, toDateOrNull } from '~~/server/utils/transactionMapper';

import { z } from 'zod';

const saleCreateSchema = z.object({
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
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => saleCreateSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const result = await db.transaction(async (tx) => {
            const transactionId = crypto.randomUUID();

            // 1. Transaction 생성
            const [newTransaction] = await tx.insert(schema.transaction).values({
                id: transactionId,
                propertyId: propertyId,
                type: 'SALE',
                year: body.year,
                quarter: body.quarter,
                executionDate: toDateOrNull(body.executionDate)!,
            }).returning();

            // 2. Sale 생성
            await tx.insert(schema.sale).values({
                id: crypto.randomUUID(),
                transactionId: transactionId,
                ...mapSaleDetailFromClientToDrizzle(body)
            });

            return newTransaction;
        });

        if (!result) {
            throw createError({ statusCode: 500, statusMessage: 'Failed to create transaction record.' });
        }

        // Fetch complete transaction with sale
        const transaction = await db.query.transaction.findFirst({
            where: (transactions, { eq }) => eq(transactions.id, result.id),
            with: { sales: true }
        });

        return transaction;

    } catch (error: any) {
        console.error('Sale Create Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create sale.', data: error.message });
    }
});
