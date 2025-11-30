import { db, schema } from '~~/server/db/db';
import { inArray } from 'drizzle-orm';

import { z } from 'zod';

const bulkDeleteSchema = z.object({
    propertyIds: z.array(z.string()).min(1, 'A valid array of Property IDs is required.')
});

export default defineEventHandler(async (event) => {
    // 1. Body 파싱
    const body = await readValidatedBody(event, (body) => bulkDeleteSchema.parse(body));
    const propertyIds = body.propertyIds;

    try {
        // 3. 일괄 삭제 실행
        // Postgres FK CASCADE handles deletion of related records
        const result = await db.delete(schema.property)
            .where(inArray(schema.property.id, propertyIds))
            .returning();

        return {
            status: 'success',
            message: `${result.length} properties have been successfully deleted.`,
            deletedCount: result.length,
        };

    } catch (error: any) {
        console.error('Bulk Property Delete Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete properties.',
            data: error.message
        });
    }
});
