import { db, schema } from '~~/server/db/db';
import { desc } from 'drizzle-orm';
import type { PropertyType } from '../../../../app/types/property.type';

export default defineEventHandler(async (event) => {
    try {
        // 1. DB 조회
        const assetsList = await db.query.property.findMany({
            columns: {
                id: true,
                name: true,
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
                scale: {
                    columns: {
                        gfaSqm: true,
                        gfaPy: true,
                    }
                },
                profitability: { columns: { grade: true, effectiveRatio: true } },
                propertyImageFiles: {
                    columns: { fileUrl: true },
                    orderBy: (files, { desc }) => [desc(files.main), desc(files.updatedAt)],
                    limit: 1
                },
                transactions: {
                    columns: { type: true },
                    limit: 1
                }
            },
            orderBy: (properties, { desc }) => [desc(properties.updatedAt)]
        });

        // 2. 매핑
        const mappedData: Partial<PropertyType>[] = assetsList.map((asset) => {
            return {
                id: asset.id,
                name: asset.name,

                // 1:1 Relations
                sector: asset.sector ? { id: '', name: asset.sector.name } : null,
                subsector: asset.subSector ? { id: '', sectorId: '', name: asset.subSector.name } : null,

                location: asset.location ? {
                    id: '', propertyId: asset.id,
                    addressFull: asset.location.addressFull,
                    addressFullJibun: null,
                    addressProvince: asset.location.addressProvince,
                    addressCity: asset.location.addressCity,
                    latitude: asset.location.latitude,
                    longitude: asset.location.longitude,
                    createdAt: new Date(), updatedAt: new Date()
                } : null,

                scale: asset.scale ? {
                    id: '', propertyId: asset.id,
                    gfaSqm: asset.scale.gfaSqm,
                    gfaPy: asset.scale.gfaPy,
                } as any : null,

                profitability: asset.profitability ? {
                    id: '', propertyId: asset.id,
                    grade: asset.profitability.grade,
                    effectiveRatio: asset.profitability.effectiveRatio,
                    createdAt: new Date(), updatedAt: new Date()
                } : null,

                // Files
                propertyImageFile: asset.propertyImageFiles.map(img => ({
                    id: '', propertyId: asset.id, main: true,
                    fileUrl: img.fileUrl,
                    fileUuid: null, fileName: null, fileKey: null, fileContentType: null,
                    createdAt: new Date(), updatedAt: new Date()
                })),

                // 1:N Relations (Empty)
                warehouse: [],
                history: [],
                propertyBrochureFile: [],
                floor: [],
                floorPlanFile: [],

                // Transaction
                transaction: asset.transactions.map(t => ({
                    id: '', propertyId: asset.id,
                    type: t.type,
                    year: '', quarter: '', executionDate: new Date(),
                    createdAt: new Date(), updatedAt: new Date(),
                    sale: null, lease: null
                }))
            };
        });

        return mappedData;

    } catch (error) {
        console.error('Main List 조회 실패:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve property list' });
    }
});
