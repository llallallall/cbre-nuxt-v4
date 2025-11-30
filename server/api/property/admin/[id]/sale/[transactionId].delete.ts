import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const { transactionId } = getRouterParams(event);

    if (!transactionId) {
        throw createError({ statusCode: 400, statusMessage: 'Transaction ID is required.' });
    }

    try {
        await db.delete(schema.transaction).where(eq(schema.transaction.id, transactionId));
        return { status: 'success' };
    } catch (error: any) {
        console.error('Sale Delete Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to delete sale.', data: error.message });
    }
});
