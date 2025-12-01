import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import { mapFloorPlanListToDrizzle } from '~~/server/utils/fileMapper';
import type { FloorPlanFileType } from '~/types/property.type';

import { z } from 'zod';

const floorPlanUpdateSchema = z.array(z.object({
    type: z.enum(['LOGITUDINALSECTION', 'CROSSSECTION', 'UPPERSECTION', 'BASEMENTSECTION']),
    floor: z.number().nullable().optional(),
    fileUuid: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    fileKey: z.string().nullable().optional(),
    fileUrl: z.string().nullable().optional(),
    fileContentType: z.string().nullable().optional(),
}));

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => floorPlanUpdateSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        await db.transaction(async (tx) => {
            // 1. 기존 도면 전체 삭제
            await tx.delete(schema.floorPlanFile).where(eq(schema.floorPlanFile.propertyId, propertyId));

            // 2. 새 리스트 일괄 생성
            const dataToInsert = mapFloorPlanListToDrizzle(body, propertyId);

            if (dataToInsert.length > 0) {
                await tx.insert(schema.floorPlanFile).values(
                    dataToInsert.map(item => ({
                        id: crypto.randomUUID(),
                        ...item
                    }))
                );
            }
        });

        // 3. 최신 데이터 조회
        const updatedList = await db.query.floorPlanFile.findMany({
            where: eq(schema.floorPlanFile.propertyId, propertyId)
        });

        // 4. 매핑 후 반환
        return updatedList.map(f => ({
            id: f.id,
            propertyId: f.propertyId,
            type: f.type,
            floor: f.floor,
            fileUuid: f.fileUuid,
            fileName: f.fileName,
            fileKey: f.fileKey,
            fileUrl: f.fileUrl,
            fileContentType: f.fileContentType,
        }));

    } catch (e: any) {
        console.error('Floor Plan Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update floor plans.', data: e.message });
    }
});
