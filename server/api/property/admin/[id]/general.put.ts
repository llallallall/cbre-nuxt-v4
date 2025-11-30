import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { TemperatureTypeEnum } from '../../../../../app/types/property.type';

import { z } from 'zod';

const generalUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    sectorId: z.string().min(1, 'Sector is required'),
    subsectorId: z.string().nullable().optional(),
    warehouse: z.array(z.object({
        temperatureType: z.enum(['ROOM', 'LOW', 'CONSTANT']),
        ratio: z.number().nullable().optional(),
    })).optional()
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => generalUpdateSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const result = await db.transaction(async (tx) => {
            // 1. Property 기본 정보 업데이트
            const [updatedProperty] = await tx.update(schema.property)
                .set({
                    name: body.name,
                    sectorId: body.sectorId,
                    subsectorId: body.subsectorId,
                })
                .where(eq(schema.property.id, propertyId))
                .returning();

            if (!updatedProperty) {
                throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
            }

            // 2. Warehouse 정보 업데이트 (삭제 후 재생성)
            await tx.delete(schema.warehouse).where(eq(schema.warehouse.propertyId, propertyId));

            if (body.warehouse && body.warehouse.length > 0) {
                await tx.insert(schema.warehouse).values(
                    body.warehouse.map((item) => ({
                        id: uuidv4(),
                        propertyId: propertyId,
                        temperatureType: item.temperatureType,
                        ratio: item.ratio,
                    }))
                );
            }

            // 3. 최신 데이터 조회
            const fetchedData = await tx.query.property.findFirst({
                where: eq(schema.property.id, propertyId),
                with: {
                    sector: true,
                    subSector: true,
                    warehouses: true
                }
            });

            return fetchedData;
        });

        return {
            id: result?.id,
            name: result?.name,
            sectorId: result?.sectorId,
            subsectorId: result?.subsectorId,
            sector: result?.sector ? { id: result.sector.id, name: result.sector.name } : null,
            subsector: result?.subSector ? { id: result.subSector.id, name: result.subSector.name } : null,
            warehouse: result?.warehouses.map(w => ({
                temperatureType: w.temperatureType,
                ratio: w.ratio
            })) ?? []
        };

    } catch (e: any) {
        console.error('General Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update general info.', data: e.message });
    }
});
