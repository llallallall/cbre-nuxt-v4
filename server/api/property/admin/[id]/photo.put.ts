import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';
import { mapImageListToDrizzle } from '~~/server/utils/fileMapper';
import type { PropertyImageFileType } from '~/types/property.type';

import { z } from 'zod';

const photoUpdateSchema = z.object({
    photoList: z.array(z.object({
        id: z.string().optional(),
        propertyId: z.string().optional(),
        main: z.boolean().optional(),
        fileUuid: z.string().nullable().optional(),
        fileName: z.string().nullable().optional(),
        fileKey: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        fileContentType: z.string().nullable().optional(),
    }))
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => photoUpdateSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        await db.transaction(async (tx) => {
            // 1. 기존 이미지 메타데이터 전체 삭제
            await tx.delete(schema.propertyImageFile).where(eq(schema.propertyImageFile.propertyId, propertyId));

            // 2. 유효한 이미지 리스트 필터링
            const validPhotos = body.photoList.filter(p => p.fileUrl);

            // 3. 새 리스트 일괄 생성
            if (validPhotos.length > 0) {
                const dataToInsert = mapImageListToDrizzle(validPhotos, propertyId);

                await tx.insert(schema.propertyImageFile).values(
                    dataToInsert.map(item => ({
                        id: crypto.randomUUID(),
                        ...item
                    }))
                );
            }
        });

        // 4. 최신 데이터 조회 및 반환
        const updatedList = await db.query.propertyImageFile.findMany({
            where: eq(schema.propertyImageFile.propertyId, propertyId),
            orderBy: (files, { desc, asc }) => [desc(files.main), asc(files.createdAt)]
        });

        return {
            photoList: updatedList.map(p => ({
                id: p.id,
                propertyId: p.propertyId,
                main: p.main,
                fileUuid: p.fileUuid,
                fileName: p.fileName,
                fileKey: p.fileKey,
                fileUrl: p.fileUrl,
                fileContentType: p.fileContentType,
            }))
        };

    } catch (e: any) {
        console.error('Photo Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update photos.', data: e.message });
    }
});
