import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import type { LeaseCreatePayload } from '~/types/property.type';
import { mapLeaseDetailFromClientToDrizzle, toDateOrNull } from '~~/server/utils/transactionMapper';

import { z } from 'zod';

const leaseUpdateSchema = z.object({
    year: z.string().min(1, 'Year is required'),
    quarter: z.string().min(1, 'Quarter is required'),
    executionDate: z.string().or(z.date()),
    leaseType: z.enum(['ASKING', 'ACTUAL']),
    floor: z.string().nullable().optional(),
    unit: z.string().nullable().optional(),
    tenant: z.string().nullable().optional(),
    leaseStartDate: z.string().or(z.date()).nullable().optional(),
    leaseEndDate: z.string().or(z.date()).nullable().optional(),
    gfaSqm: z.number().nullable().optional(),
    gfaPy: z.number().nullable().optional(),
    nfaSqm: z.number().nullable().optional(),
    nfaPy: z.number().nullable().optional(),
    effRatio: z.number().nullable().optional(),
    monthlyRent: z.number().nullable().optional(),
    monthlyCamf: z.number().nullable().optional(),
    deposit: z.number().nullable().optional(),
    rentMonthlyPy: z.number().nullable().optional(),
    camfMonthlyPy: z.number().nullable().optional(),
    depositPy: z.number().nullable().optional(),
    iod: z.number().nullable().optional(),
    gdm: z.number().nullable().optional(),
    noc: z.number().nullable().optional(),
    leaseTermYear: z.number().nullable().optional(),
    rentFreeType: z.enum(['PerYear', 'PerTerm']).nullable().optional(),
    rentFreeMonth: z.number().nullable().optional(),
    effectiveNoc: z.number().nullable().optional(),
    fitOut: z.number().nullable().optional(),
    tiAmountKrw: z.number().nullable().optional(),
    tiAmountNfaPy: z.number().nullable().optional(),
    totalFreeRentPeriodMonth: z.number().nullable().optional(),
    totalOccupyingPeriodYear: z.number().nullable().optional(),
    totalFreeRentOccupyingYear: z.number().nullable().optional(),
    monthlyCashSupportGfa: z.number().nullable().optional(),
    allInEffectiveRentMonthlyPy: z.number().nullable().optional(),
    allInNoc: z.number().nullable().optional(),
});

export default defineEventHandler(async (event) => {
    const { transactionId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => leaseUpdateSchema.parse(body));

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

            // 2. Lease 상세 정보 업데이트
            await tx.update(schema.lease)
                .set(mapLeaseDetailFromClientToDrizzle(body))
                .where(eq(schema.lease.transactionId, transactionId));
        });

        return { message: 'Lease updated successfully', id: transactionId };

    } catch (error: any) {
        console.error('Lease Update Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update lease transaction.',
            data: error.message
        });
    }
});
