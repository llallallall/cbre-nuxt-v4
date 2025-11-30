import { db, schema } from '~~/server/db/db';
import { desc, asc } from 'drizzle-orm';
import type { AdminListType } from '../../../../app/types/property.type';

export default defineEventHandler(async (event) => {
    try {
        // 1. DB에서 목록 데이터 조회
        const assetsList = await db.query.property.findMany({
            columns: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
            with: {
                location: {
                    columns: {
                        addressFull: true,
                        addressProvince: true,
                        addressCity: true,
                        latitude: true,
                        longitude: true,
                    }
                },
                sector: { columns: { name: true } },
                subSector: { columns: { name: true } },
                profitability: { columns: { grade: true } },
                propertyImageFiles: {
                    columns: { fileUrl: true },
                    orderBy: (files, { desc }) => [desc(files.main), desc(files.updatedAt)],
                    limit: 1
                }
            },
            orderBy: (properties, { desc, asc }) => [desc(properties.updatedAt), asc(properties.name)]
        });

        // 2. 데이터 매핑 (DB camelCase -> Client camelCase [AdminListType])
        const listData: AdminListType[] = assetsList.map((asset, index) => {
            // 메인 이미지 URL 추출 (없으면 null)
            const mainImageUrl = asset.propertyImageFiles[0]?.fileUrl || null;

            return {
                // 목록 표시용 순번 (전체 개수부터 역순)
                no: assetsList.length - index,

                // 기본 정보
                propertyId: asset.id,
                propertyName: asset.name,
                mainImageUrl: mainImageUrl,

                // 분류 및 등급 (Relation이 없으면 빈 문자열/null 처리)
                grade: asset.profitability?.grade || null,
                sector: asset.sector?.name || 'N/A',
                subSector: asset.subSector?.name || null,

                // 위치 정보
                addressFull: asset.location?.addressFull || null,
                addressProvince: asset.location?.addressProvince || null,
                addressCity: asset.location?.addressCity || null,
                latitude: asset.location?.latitude || null,
                longitude: asset.location?.longitude || null,

                // 메타 데이터 (Admin 관리용)
                createdAt: new Date(asset.createdAt),
                updatedAt: new Date(asset.updatedAt)
            };
        });

        // 3. 최종 결과 반환
        return listData;

    } catch (error) {
        console.error('Admin List 조회 실패:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve admin asset list' });
    }
});
