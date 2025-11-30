import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const { transactionId } = getRouterParams(event);

    if (!transactionId) {
        throw createError({ statusCode: 400, statusMessage: 'Transaction ID is required.' });
    }

    try {
        // Transaction만 삭제하면 연결된 Lease도 삭제됨 (Cascade 설정 가정)
        await db.delete(schema.transaction).where(eq(schema.transaction.id, transactionId));

        return { status: 'success', message: 'Lease transaction deleted.' };

    } catch (error: any) {
        console.error('Lease Delete Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete lease transaction.',
            data: error.message
        });
    }
});
