import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import { mapBrochureListToDrizzle } from '~~/server/utils/fileMapper';
import type { PropertyBrochureFileType } from '~/types/property.type';

import { z } from 'zod';

const brochureUpdateSchema = z.object({
    brochureList: z.array(z.object({
        id: z.string().optional(),
        propertyId: z.string().optional(),
        fileUuid: z.string().nullable().optional(),
        fileName: z.string().nullable().optional(),
        fileKey: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        fileContentType: z.string().nullable().optional(),
    }))
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => brochureUpdateSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        await db.transaction(async (tx) => {
            // 1. 기존 브로슈어 전체 삭제
            await tx.delete(schema.propertyBrochureFile).where(eq(schema.propertyBrochureFile.propertyId, propertyId));

            // 2. 유효한 파일 필터링
            const validFiles = body.brochureList.filter(f => f.fileUrl);

            // 3. 새 리스트 일괄 생성
            if (validFiles.length > 0) {
                const dataToInsert = mapBrochureListToDrizzle(validFiles, propertyId);

                await tx.insert(schema.propertyBrochureFile).values(
                    dataToInsert.map(item => ({
                        id: crypto.randomUUID(),
                        ...item
                    }))
                );
            }
        });

        // 4. 최신 데이터 조회
        const updatedList = await db.query.propertyBrochureFile.findMany({
            where: eq(schema.propertyBrochureFile.propertyId, propertyId),
            orderBy: (files, { asc }) => [asc(files.createdAt)]
        });

        return {
            brochureList: updatedList.map(b => ({
                id: b.id,
                propertyId: b.propertyId,
                fileUuid: b.fileUuid,
                fileName: b.fileName,
                fileKey: b.fileKey,
                fileUrl: b.fileUrl,
                fileContentType: b.fileContentType,
            }))
        };

    } catch (e: any) {
        console.error('Brochure Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update brochures.', data: e.message });
    }
});
