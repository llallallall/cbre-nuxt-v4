import { db, schema } from '~~/server/db/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const email = query.email as string;

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'Email is required.' });
    }

    try {
        const user = await db.query.user.findFirst({
            where: eq(schema.user.email, email),
            columns: { id: true }
        });

        // 사용자가 존재하면 true (중복됨), 없으면 false (사용 가능)
        return user ? true : false;

    } catch (error) {
        console.error('Check Email Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to check email.' });
    }
});
