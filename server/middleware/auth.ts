import { defineEventHandler, getRequestURL, createError } from 'h3'
import { getUserSession } from '#imports'

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)

    // API 경로만 보호 (auth 관련 경로 및 공개 API 제외)
    if (url.pathname.startsWith('/api') &&
        !url.pathname.startsWith('/api/auth') &&
        !url.pathname.startsWith('/api/property/list') &&
        !url.pathname.startsWith('/api/_nuxt_icon')) {

        const session = await getUserSession(event)

        if (!session.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
                message: 'Login is required.'
            })
        }
    }
})
