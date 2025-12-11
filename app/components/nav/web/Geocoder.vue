<template>
        <div class="w-full h-full overflow-y-auto overflow-x-hidden mt-2 mb-5 space-y-4 pr-4">

                <div v-if="internalProperties.length > 0">
                        <h3 class="cbre-text-label-sm text-gray-500 mb-2 px-1">Properties ({{ internalProperties.length
                                }})</h3>
                        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
                                <div v-for="(item, index) in internalProperties" :key="`ip-${index}`">
                                        <NavWebSearchResultProperty :item="item" class="h-full" />
                                </div>
                        </div>
                </div>

                <div v-if="kakaoAddress.length > 0">
                        <h3 class="cbre-text-label-sm text-gray-500 mb-2 px-1">Kakao Address ({{ kakaoAddress.length }})
                        </h3>
                        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
                                <div v-for="(item, index) in kakaoAddress" :key="`ka-${index}`">
                                        <NavWebSearchResultAddress :item="item" class="h-full" />
                                </div>
                        </div>
                </div>

                <div v-if="kakaoKeyword.length > 0">
                        <h3 class="cbre-text-label-sm text-gray-500 mb-2 px-1 mt-4">Kakao Places ({{ kakaoKeyword.length
                                }})</h3>
                        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
                                <div v-for="(item, index) in kakaoKeyword" :key="`kk-${index}`">
                                        <NavWebSearchResultKeyword :item="item" class="h-full" />
                                </div>
                        </div>
                </div>

                <div v-if="googleGeocoder.length > 0">
                        <h3 class="cbre-text-label-sm text-gray-500 mb-2 px-1 mt-4">Google Results ({{
                                googleGeocoder.length }})</h3>
                        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
                                <div v-for="(item, index) in googleGeocoder" :key="`gg-${index}`">
                                        <NavWebSearchResultGeocoder :item="item" class="h-full" />
                                </div>
                        </div>
                </div>

                <div v-if="!hasResults && hasSearched" class="text-center text-gray-400 py-10">
                        No results found.
                </div>

                <!-- Helper div for Places Service -->
                <div id="places-service-helper"></div>


        </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import useGoogleMapsApi from '@/composables/useGoogleMapsApi';

declare var google: any;

const config = useRuntimeConfig();
const KAKAO_API_KEY = config.public.kakaoLocalApiToken;

const mapStore = useMapStore();
const propertyStore = usePropertyStore();
const { kakaoAddress, kakaoKeyword, googleGeocoder, internalProperties } = storeToRefs(mapStore);
const hasSearched = ref(false);

const hasResults = computed(() =>
        kakaoAddress.value.length > 0 ||
        kakaoKeyword.value.length > 0 ||
        googleGeocoder.value.length > 0 ||
        internalProperties.value.length > 0
);

// Google Maps API 로드
onMounted(async () => {
        try {
                // @ts-ignore
                await useGoogleMapsApi();
        } catch (e) {
                console.error('Google Maps API Load Error:', e);
        }
});

/**
 * 🔍 통합 검색 함수 (부모 컴포넌트에서 호출)
 */
const searchResult = async (keyword: string) => {
        hasSearched.value = true;

        // 1. 결과 초기화
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];
        internalProperties.value = [];

        // 2. 병렬로 검색 요청 실행
        await Promise.allSettled([
                searchInternalProperties(keyword),
                searchKakaoAddress(keyword),
                searchKakaoKeyword(keyword),
                searchGoogleGeocoder(keyword)
        ]);
};

// --- 0. Internal Property Search ---
const searchInternalProperties = async (query: string) => {
        if (!propertyStore.initialProperties.length) return;

        const lowerQuery = query.toLowerCase().trim();
        const results = propertyStore.initialProperties.filter(p => {
                return (
                        p.name.toLowerCase().includes(lowerQuery) ||
                        p.location?.addressFull?.toLowerCase().includes(lowerQuery)
                );
        });

        internalProperties.value = results.map(p => ({
                id: p.id,
                name: p.name,
                addressFull: p.location?.addressFull,
                latitude: p.location?.latitude,
                longitude: p.location?.longitude,
                sector: p.sector?.name,
                grade: p.profitability?.grade
        }));
};

// --- A. Kakao Address Search ---
const searchKakaoAddress = async (query: string) => {
        console.log(`Searching Kakao Address (Server Proxy): ${query}`);
        try {
                const data = await $fetch<any>('/api/search/kakaoAddress', {
                        params: { query, analyze_type: 'similar', page: 1, size: 10 }
                });

                console.log("Kakao Address Response Data:", data);

                if (data && data.documents) {
                        kakaoAddress.value = data.documents.map((item: any) => ({
                                name: item.address_name,
                                type: item.address_type,
                                province: item.address?.region_1depth_name,
                                city: item.address?.region_2depth_name,
                                street: item.address?.region_3depth_name,
                                longitude: item.x,
                                latitude: item.y
                        }));
                        console.log("Mapped Kakao Address:", kakaoAddress.value);
                } else {
                        console.warn("Kakao Address: No documents found in response", data);
                }
        } catch (e) {
                console.error('Kakao Address Search Error:', e);
        }
};

// --- B. Kakao Keyword Search ---
const searchKakaoKeyword = async (query: string) => {
        try {
                // Revert to Client-side for Keyword Search (usually CORS safe)
                const data = await $fetch<any>('https://dapi.kakao.com/v2/local/search/keyword.json', {
                        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
                        params: { query, page: 1, size: 10 }
                });

                console.log("Kakao Keyword Response Data:", data);

                if (data && data.documents) {
                        kakaoKeyword.value = data.documents.map((item: any) => ({
                                name: item.place_name,
                                type: 'KEYWORD',
                                category: item.category_name,
                                address: item.address_name,
                                place_url: item.place_url,
                                road_address: item.road_address_name,
                                longitude: item.x,
                                latitude: item.y
                        }));
                        console.log("Mapped Kakao Keyword:", kakaoKeyword.value);
                } else {
                        console.warn("Kakao Keyword: No documents found in response", data);
                }
        } catch (e) {
                console.error('Kakao Keyword Search Error:', e);
        }
};

// --- C. Google Geocoder Search ---
// --- C. Google Geocoder (Places) Search ---
const searchGoogleGeocoder = async (query: string) => {
        // Ensure API is loaded
        try {
                // @ts-ignore
                await useGoogleMapsApi();
        } catch (e) {
                console.error("Google API failed to load in search", e)
        }

        if (!window.google || !window.google.maps || !window.google.maps.places) {
                console.warn("Google Maps Places API not available");
                return;
        }

        console.log("Searching Google Places for:", query);

        try {
                const mapDiv = document.getElementById('places-service-helper') as HTMLDivElement;
                const service = new window.google.maps.places.PlacesService(mapDiv);

                const results = await new Promise<any[]>((resolve, reject) => {
                        const request = {
                                query: query,
                                fields: ['name', 'formatted_address', 'geometry', 'types'],
                        };

                        service.textSearch(request, (results: any[], status: any) => {
                                console.log("Google Places Status:", status);
                                if (status === window.google?.maps.places.PlacesServiceStatus.OK && results) {
                                        resolve(results);
                                } else {
                                        // ZERO_RESULTS is not an error, just empty
                                        if (status === window.google?.maps.places.PlacesServiceStatus.ZERO_RESULTS) resolve([]);
                                        else reject(status);
                                }
                        });
                });

                console.log("Google Places Results:", results);

                if (results) {
                        googleGeocoder.value = results.map((item) => {
                                return {
                                        name: item.name,
                                        formatted_address: item.formatted_address,
                                        type: 'Google',
                                        category: item.types?.[0],
                                        address: item.formatted_address,
                                        latitude: item.geometry.location.lat(),
                                        longitude: item.geometry.location.lng(),
                                };
                        });
                }

        } catch (e) {
                console.warn('Google Places Search failed:', e);
        }
};

// 💡 defineExpose를 통해 부모 컴포넌트(SearchPannel)에서 searchResult 함수를 호출할 수 있게 함
defineExpose({
        searchResult
});
</script>
