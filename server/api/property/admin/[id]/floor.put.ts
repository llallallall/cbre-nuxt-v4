import { db, schema } from '~~/server/db/db';
import { eq, notInArray, and } from 'drizzle-orm';
import type { FloorPayload, FloorPartialPayload } from '~/types/property.type';

// (Floor 모델과 FloorPartial 모델 전체 필드에 대한 변환 필요)
const transformFloorToResponse = (floor: any): FloorPayload => {
    return {
        floorId: floor.id,
        propertyId: floor.propertyId,
        type: floor.type,
        floor: floor.floor,
        ceilingHeight: floor.ceilingHeight,
        ceilingHeightUnit: floor.ceilingHeightUnit,
        floorLoad: floor.floorLoad,
        floorLoadUnit: floor.floorLoadUnit,
        truckBerths: floor.truckBerths,
        use: floor.use,
        totalAreaSqm: floor.totalAreaSqm,
        totalAreaPy: floor.totalAreaPy,
        grossLeasableAreaSqm: floor.grossLeasableAreaSqm,
        grossLeasableAreaPy: floor.grossLeasableAreaPy,
        netLeasableAreaSqm: floor.netLeasableAreaSqm,
        netLeasableAreaPy: floor.netLeasableAreaPy,
        floorPartial: floor.floorPartials.map((partial: any) => ({
            id: partial.id,
            floorId: partial.floorId,
            unitNumber: partial.unitNumber,
            tenant: partial.tenant,
            leaseAreaSqm: partial.leaseAreaSqm,
            leaseAreaPy: partial.leaseAreaPy,
            tenantEquipment: partial.tenantEquipment,
            tenantUse: partial.tenantUse,
            leaseStartDate: partial.leaseStartDate,
            leaseEndDate: partial.leaseEndDate,
            depositKrw: partial.depositKrw,
            monthlyRentPerPy: partial.monthlyRentPerPy,
            monthlyRent: partial.monthlyRent,
            monthlyManagementPerPy: partial.monthlyManagementPerPy,
            monthlyManagementFee: partial.monthlyManagementFee,
            increaseConditionsForDeposit: partial.increaseConditionsForDeposit,
            increaseConditionsForRent: partial.increaseConditionsForRent,
            increaseConditionsForManagementFee: partial.increaseConditionsForManagementFee,
            rentFree: partial.rentFree,
            fitOut: partial.fitOut,
        })) as FloorPartialPayload[],
    } as FloorPayload;
};

import { z } from 'zod';

const floorSchema = z.array(z.object({
    floorId: z.string().optional(),
    propertyId: z.string().optional(),
    type: z.enum(['UPPER', 'BASEMENT']),
    floor: z.number().optional(),
    ceilingHeight: z.number().nullable().optional(),
    ceilingHeightUnit: z.string().nullable().optional(),
    floorLoad: z.number().nullable().optional(),
    floorLoadUnit: z.string().nullable().optional(),
    truckBerths: z.number().nullable().optional(),
    use: z.enum(['ROOM', 'OFFICE', 'LOW', 'CONSTANT']).nullable().optional(),
    totalAreaSqm: z.number().nullable().optional(),
    totalAreaPy: z.number().nullable().optional(),
    grossLeasableAreaSqm: z.number().nullable().optional(),
    grossLeasableAreaPy: z.number().nullable().optional(),
    netLeasableAreaSqm: z.number().nullable().optional(),
    netLeasableAreaPy: z.number().nullable().optional(),
    floorPartial: z.array(z.object({
        id: z.string().optional(),
        floorId: z.string().optional(),
        unitNumber: z.string().nullable().optional(),
        tenant: z.string().nullable().optional(),
        leaseAreaSqm: z.number().nullable().optional(),
        leaseAreaPy: z.number().nullable().optional(),
        tenantEquipment: z.boolean().optional(),
        tenantUse: z.enum(['DRY', 'COLD', 'OFFICE', 'OTHERS']).nullable().optional(),
        leaseStartDate: z.string().or(z.date()).nullable().optional(),
        leaseEndDate: z.string().or(z.date()).nullable().optional(),
        depositKrw: z.number().nullable().optional(),
        monthlyRentPerPy: z.number().nullable().optional(),
        monthlyRent: z.number().nullable().optional(),
        monthlyManagementPerPy: z.number().nullable().optional(),
        monthlyManagementFee: z.number().nullable().optional(),
        increaseConditionsForDeposit: z.string().nullable().optional(),
        increaseConditionsForRent: z.string().nullable().optional(),
        increaseConditionsForManagementFee: z.string().nullable().optional(),
        rentFree: z.string().nullable().optional(),
        fitOut: z.string().nullable().optional(),
    })).optional()
}));

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => floorSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const result = await db.transaction(async (tx) => {
            // 1. 기존 Floor 데이터 중, 이번 요청에 포함되지 않은 Floor 삭제
            const incomingFloorIds = body
                .filter(f => f.floorId && !f.floorId.startsWith('temp_'))
                .map(f => f.floorId as string);

            if (incomingFloorIds.length > 0) {
                await tx.delete(schema.floor).where(and(
                    eq(schema.floor.propertyId, propertyId),
                    notInArray(schema.floor.id, incomingFloorIds)
                ));
            } else {
                // If no existing IDs provided, delete all floors?
                // Or maybe all are new.
                // If body is empty, delete all.
                if (body.length === 0) {
                    await tx.delete(schema.floor).where(eq(schema.floor.propertyId, propertyId));
                } else {
                    // If body has items but all are new, delete all existing?
                    // Yes, because we replace the list.
                    // But wait, if incomingFloorIds is empty, it means all are new.
                    // So we should delete all existing floors for this property.
                    await tx.delete(schema.floor).where(eq(schema.floor.propertyId, propertyId));
                }
            }

            // 2. 각 Floor 데이터 Upsert
            for (const floorData of body) {
                const { floorPartial, ...floorMain } = floorData;
                const isNewFloor = !floorMain.floorId || floorMain.floorId.startsWith('temp_');

                const floorInput = {
                    propertyId: propertyId,
                    type: floorMain.type,
                    floor: floorMain.floor,
                    ceilingHeight: floorMain.ceilingHeight,
                    ceilingHeightUnit: floorMain.ceilingHeightUnit,
                    floorLoad: floorMain.floorLoad,
                    floorLoadUnit: floorMain.floorLoadUnit,
                    truckBerths: floorMain.truckBerths,
                    use: floorMain.use,
                    totalAreaSqm: floorMain.totalAreaSqm,
                    totalAreaPy: floorMain.totalAreaPy,
                    grossLeasableAreaSqm: floorMain.grossLeasableAreaSqm,
                    grossLeasableAreaPy: floorMain.grossLeasableAreaPy,
                    netLeasableAreaSqm: floorMain.netLeasableAreaSqm,
                    netLeasableAreaPy: floorMain.netLeasableAreaPy,
                };

                let savedFloorId: string;

                if (isNewFloor) {
                    savedFloorId = crypto.randomUUID();
                    await tx.insert(schema.floor).values({
                        id: savedFloorId,
                        ...floorInput
                    });
                } else {
                    savedFloorId = floorMain.floorId!;
                    await tx.update(schema.floor)
                        .set(floorInput)
                        .where(eq(schema.floor.id, savedFloorId));
                }

                // 3. FloorPartial (호실) 데이터 처리
                await tx.delete(schema.floorPartial).where(eq(schema.floorPartial.floorId, savedFloorId));

                if (floorPartial && floorPartial.length > 0) {
                    await tx.insert(schema.floorPartial).values(
                        floorPartial.map(p => ({
                            id: crypto.randomUUID(),
                            floorId: savedFloorId,
                            unitNumber: p.unitNumber,
                            tenant: p.tenant,
                            leaseAreaSqm: p.leaseAreaSqm,
                            leaseAreaPy: p.leaseAreaPy,
                            tenantEquipment: p.tenantEquipment,
                            tenantUse: p.tenantUse,
                            leaseStartDate: p.leaseStartDate ? new Date(p.leaseStartDate).toISOString() : null,
                            leaseEndDate: p.leaseEndDate ? new Date(p.leaseEndDate).toISOString() : null,
                            depositKrw: p.depositKrw,
                            monthlyRentPerPy: p.monthlyRentPerPy,
                            monthlyRent: p.monthlyRent,
                            monthlyManagementPerPy: p.monthlyManagementPerPy,
                            monthlyManagementFee: p.monthlyManagementFee,
                            increaseConditionsForDeposit: p.increaseConditionsForDeposit,
                            increaseConditionsForRent: p.increaseConditionsForRent,
                            increaseConditionsForManagementFee: p.increaseConditionsForManagementFee,
                            rentFree: p.rentFree,
                            fitOut: p.fitOut
                        }))
                    );
                }
            }

            // 4. 최종 결과 반환
            return await tx.query.floor.findMany({
                where: eq(schema.floor.propertyId, propertyId),
                with: { floorPartials: true },
                orderBy: (floors, { desc }) => [desc(floors.floor)]
            });
        });

        return result.map(transformFloorToResponse);

    } catch (e: any) {
        console.error('Floor Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update floor data.', data: e.message });
    }
});
