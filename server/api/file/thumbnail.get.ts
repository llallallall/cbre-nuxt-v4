import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const bucket = 'cbre-assets';

    const query = getQuery(event);
    const originalKey = query.key as string;

    if (!originalKey) {
        throw createError({ statusCode: 400, statusMessage: 'File key is required' });
    }

    const publicBaseUrl = `https://${config.MINIO_SERVER_URL}/${bucket}`;

    return sendRedirect(event, `${publicBaseUrl}/${originalKey}`, 307);
});
