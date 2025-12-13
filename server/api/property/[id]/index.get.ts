import { db, schema } from '~~/server/db/db';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required' });
    }

    try {
        const data = await db.query.property.findFirst({
            where: eq(schema.property.id, id),
            with: {
                sector: true,
                subSector: true,
                location: true,
                scale: true,
                facility: true,
                accessibility: true,
                profitability: true,
                warehouses: true,
                histories: true,
                propertyImageFiles: true,
                propertyBrochureFiles: true,
                floorPlanFiles: true,
                floors: {
                    with: {
                        floorPartials: true
                    },
                    orderBy: (floors, { desc }) => [desc(floors.floor)]
                },
                transactions: {
                    with: {
                        sales: true,
                        leases: true
                    },
                    orderBy: (transactions, { desc }) => [desc(transactions.executionDate)]
                }
            }
        });

        if (!data) {
            throw createError({ statusCode: 404, statusMessage: 'Property not found' });
        }

        // Drizzle returns camelCase properties matching the schema definition.
        // However, relations like 'sales' are arrays due to schema definition, but logically 1:1.
        // We map them to singular if needed, or keep as is.
        // The v2 API returned 'sale' (object) and 'lease' (object).
        // We will map 'sales[0]' to 'sale'.

        return {
            ...data,
            warehouse: data.warehouses,
            history: data.histories,
            propertyImageFile: data.propertyImageFiles,
            propertyBrochureFile: data.propertyBrochureFiles,
            floorPlanFile: data.floorPlanFiles,
            floor: data.floors,
            // transactions -> transaction (Singular key as per type definition)
            transaction: data.transactions.map(t => ({
                ...t,
                sale: t.sales.length > 0 ? t.sales[0] : null,
                lease: t.leases.length > 0 ? t.leases[0] : null,
                sales: undefined, // Remove array
                leases: undefined // Remove array
            }))
        };

    } catch (error) {
        console.error('Failed to fetch property details:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch property details' });
    }
});
