import { db, schema } from '~~/server/db/db';
import type { LeaseCreatePayload } from '~/types/property.type';
import { mapLeaseDetailFromClientToDrizzle, toDateOrNull } from '~~/server/utils/transactionMapper';

import { z } from 'zod';

const leaseCreateSchema = z.object({
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
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => leaseCreateSchema.parse(body));

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
                type: 'LEASE',
                year: body.year,
                quarter: body.quarter,
                executionDate: toDateOrNull(body.executionDate)!,
            }).returning();

            // 2. Lease 생성
            await tx.insert(schema.lease).values({
                id: crypto.randomUUID(),
                transactionId: transactionId,
                ...mapLeaseDetailFromClientToDrizzle(body)
            });

            return newTransaction;
        });

        if (!result) {
            throw createError({ statusCode: 500, statusMessage: 'Failed to create transaction record.' });
        }

        // Fetch complete transaction with lease
        const transaction = await db.query.transaction.findFirst({
            where: (transactions, { eq }) => eq(transactions.id, result.id),
            with: { leases: true } // Assuming 'leases' relation name
        });

        return transaction;

    } catch (error: any) {
        console.error('Lease Create Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create lease transaction.',
            data: error.message
        });
    }
});
