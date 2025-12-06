<template>
        <div class="cbre-panel-container">
                <!-- Header Section (Dark Green Theme) with Stacked Search -->
                <div class="cbre-panel-header">

                        <!-- Title & Text -->
                        <div class="relative z-10 w-full mb-6 flex justify-between items-center">
                                <h2 class="cbre-panel-title">Web Location Search</h2>
                                <div class="flex items-center gap-4">
                                        <button @click="onClearPins"
                                                class="cbre-button-tertiary group text-gray-400 hover:gap-2 hover:text-red-400 transition-colors !p-0 mr-4 transform translate-y-[-4px]"
                                                title="Clear all pins on map">
                                                <UIcon name="i-heroicons-trash" class="w-5 h-5 mr-1" />
                                                <span>Clear Pins</span>
                                        </button>
                                        <button @click="handleClose"
                                                class="text-gray-400 hover:text-white transition-colors"
                                                title="Close Panel">
                                                <UIcon name="i-heroicons-x-mark" size="30" />
                                        </button>
                                </div>
                        </div>

                        <!-- Search Input (Full Width)-->
                        <div class="cbre-input-search-box">
                                <div class="relative flex items-center">
                                        <input v-model="searchWebText" type="text" name="search" autocomplete="off"
                                                @keyup.enter="onSearchText" class="cbre-input-search-field"
                                                placeholder="Search by Market, Address or Keyword..." />

                                        <!-- Search Icon -->
                                        <div class="cbre-input-search-icon-wrapper" @click="onSearchText">
                                                <IconMagnifier class="w-5 h-5" />
                                        </div>
                                </div>
                        </div>
                        <div class="relative z-10 w-full mb-6">
                                <p class="cbre-panel-description">
                                        Explore properties and locations across the region.
                                </p>
                        </div>

                        <!-- Hero Image -->
                        <div class="relative w-full h-[20rem]">
                                <img src="/images/search-bg.webp" class="cbre-image" alt="Insights Hero" />
                                <!-- Gradient Overlay -->
                                <div
                                        class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50">
                                </div>
                        </div>
                </div>



                <!-- Results Section -->
                <div class="flex flex-col w-full flex-1 pl-8 pr-0 py-0 overflow-hidden">

                        <!-- Clear Button (Text only if needed) -->
                        <div v-if="searchWebText" class="flex  mb-2 shrink-0">
                                <button @click="onResetKeyword" class="cbre-text-link-icon-slide">Clear Text</button>
                        </div>

                        <!-- Geocoder Component -->
                        <div class="flex-1 overflow-hidden">
                                <NavWebGeocoder ref="geocoderRef" />
                        </div>
                </div>

                <!-- Footer / Close Section (Removed as actions moved to top) -->
                <!-- <div class="cbre-panel-footer"></div> -->
        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';

// 💡 자식 컴포넌트 (Geocoder.vue)의 타입을 임시로 정의 (expose된 메소드)
interface GeocoderComponent {
        searchResult: (keyword: string) => Promise<void>;
}

const emit = defineEmits(['isClosed']);
const mapStore = useMapStore();
const { searchedMarkers, kakaoAddress, kakaoKeyword, googleGeocoder } = storeToRefs(mapStore);

const searchWebText = ref('');
const geocoderRef = ref<GeocoderComponent | null>(null); // 💡 타입 명시

// 검색 실행
const onSearchText = () => {
        if (!searchWebText.value.trim()) {
                alert('Please enter text to search.');
                return;
        }
        // 자식 컴포넌트의 searchResult 함수 호출
        geocoderRef.value?.searchResult(searchWebText.value);
};

// 검색어 초기화
const onResetKeyword = () => {
        searchWebText.value = '';
        // Store의 검색 결과 상태 초기화
        searchedMarkers.value = [];
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];
};

const handleClose = () => {
        emit('isClosed', true);
        // onResetKeyword(); // User might want to keep results when closing panel temporarily?
        // If we want "sidebar" behavior, maybe we don't auto-clear?
        // But for now let's keep it simple.
};

const onClearPins = () => {
        mapStore.clearSearchedMarkers();
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];
};
</script>

<style scoped>
/* 스타일은 Tailwind로 대부분 대체되었으므로 최소화 */
.search-input:not(:placeholder-shown)~label {
        /* v-model 값이 있을 때 label 위로 이동 (floating label) */
        top: -8px;
        font-size: 1.2rem;
        color: var(--color-primary);
}
</style>
