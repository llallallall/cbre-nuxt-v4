import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
        const config = useRuntimeConfig();
        const query = getQuery(event);
        const KAKAO_API_KEY = config.public.kakaoLocalApiToken;

        if (!query.query) {
                return { documents: [] };
        }

        try {
                const response = await $fetch('https://dapi.kakao.com/v2/local/search/keyword.json', {
                        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
                        params: {
                                query: query.query,
                                page: query.page || 1,
                                size: query.size || 10
                        }
                });
                return response;
        } catch (error) {
                console.error('Kakao Keyword Search Server Error:', error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to fetch from Kakao API'
                });
        }
});
