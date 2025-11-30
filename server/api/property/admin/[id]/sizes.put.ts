import { db, schema } from '~~/server/db/db';
import { eq, and, gt, lt } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod';

const sizesSchema = z.object({
    noOfBuildings: z.number().optional(),
    upperLevels: z.number().optional(),
    basementLevels: z.number().optional(),
    gfaSqm: z.number().nullable().optional(),
    gfaPy: z.number().nullable().optional(),
    nfaSqm: z.number().nullable().optional(),
    nfaPy: z.number().nullable().optional(),
    siteAreaSqm: z.number().nullable().optional(),
    siteAreaPy: z.number().nullable().optional(),
    grossLeasableAreaSqm: z.number().nullable().optional(),
    grossLeasableAreaPy: z.number().nullable().optional(),
    netLeasableAreaSqm: z.number().nullable().optional(),
    netLeasableAreaPy: z.number().nullable().optional(),
    floorAreaRatioExisting: z.number().nullable().optional(),
    floorAreaRatioPermitted: z.number().nullable().optional(),
    buildingCoverageRatioExisting: z.number().nullable().optional(),
    buildingCoverageRatioPermitted: z.number().nullable().optional(),
    floorPlateSqm: z.number().nullable().optional(),
    floorPlatePy: z.number().nullable().optional(),
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => sizesSchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const result = await db.transaction(async (tx) => {
            const dataInput = {
                noOfBuildings: body.noOfBuildings ?? 0,
                upperLevels: body.upperLevels ?? 0,
                basementLevels: body.basementLevels ?? 0,
                gfaSqm: body.gfaSqm,
                gfaPy: body.gfaPy,
                nfaSqm: body.nfaSqm,
                nfaPy: body.nfaPy,
                siteAreaSqm: body.siteAreaSqm,
                siteAreaPy: body.siteAreaPy,
                grossLeasableAreaSqm: body.grossLeasableAreaSqm,
                grossLeasableAreaPy: body.grossLeasableAreaPy,
                netLeasableAreaSqm: body.netLeasableAreaSqm,
                netLeasableAreaPy: body.netLeasableAreaPy,
                floorAreaRatioExisting: body.floorAreaRatioExisting,
                floorAreaRatioPermitted: body.floorAreaRatioPermitted,
                buildingCoverageRatioExisting: body.buildingCoverageRatioExisting,
                buildingCoverageRatioPermitted: body.buildingCoverageRatioPermitted,
                floorPlateSqm: body.floorPlateSqm,
                floorPlatePy: body.floorPlatePy,
            };

            const [updatedScale] = await tx.insert(schema.scale).values({
                id: uuidv4(),
                propertyId: propertyId,
                ...dataInput
            })
                .onConflictDoUpdate({
                    target: schema.scale.propertyId,
                    set: dataInput
                })
                .returning();

            if (!updatedScale) {
                throw new Error('Failed to upsert scale data');
            }

            // 2. 층수 변경에 따른 Floor 데이터 정리
            const newUpper = body.upperLevels ?? 0;
            const newBasement = body.basementLevels ?? 0;

            if (newUpper > 0) {
                await tx.delete(schema.floor).where(and(
                    eq(schema.floor.propertyId, propertyId),
                    eq(schema.floor.type, 'UPPER'),
                    gt(schema.floor.floor, newUpper)
                ));
            }

            if (newBasement > 0) {
                await tx.delete(schema.floor).where(and(
                    eq(schema.floor.propertyId, propertyId),
                    eq(schema.floor.type, 'BASEMENT'),
                    lt(schema.floor.floor, -newBasement)
                ));
            }

            return {
                noOfBuildings: updatedScale.noOfBuildings,
                upperLevels: updatedScale.upperLevels,
                basementLevels: updatedScale.basementLevels,
                gfaSqm: updatedScale.gfaSqm,
                gfaPy: updatedScale.gfaPy,
                nfaSqm: updatedScale.nfaSqm,
                nfaPy: updatedScale.nfaPy,
                siteAreaSqm: updatedScale.siteAreaSqm,
                siteAreaPy: updatedScale.siteAreaPy,
                grossLeasableAreaSqm: updatedScale.grossLeasableAreaSqm,
                grossLeasableAreaPy: updatedScale.grossLeasableAreaPy,
                netLeasableAreaSqm: updatedScale.netLeasableAreaSqm,
                netLeasableAreaPy: updatedScale.netLeasableAreaPy,
                floorAreaRatioExisting: updatedScale.floorAreaRatioExisting,
                floorAreaRatioPermitted: updatedScale.floorAreaRatioPermitted,
                buildingCoverageRatioExisting: updatedScale.buildingCoverageRatioExisting,
                buildingCoverageRatioPermitted: updatedScale.buildingCoverageRatioPermitted,
                floorPlateSqm: updatedScale.floorPlateSqm,
                floorPlatePy: updatedScale.floorPlatePy,
            };
        });

        return result;

    } catch (e: any) {
        console.error('Sizes(Scale) Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update sizes info.', data: e.message });
    }
});
