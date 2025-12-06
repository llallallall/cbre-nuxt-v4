<template>
        <div class="flex flex-col w-full h-full bg-white font-calibre border-l border-gray-100 shadow-xl">
                <!-- Header Section (Dark Green Theme) with Stacked Search -->
                <div
                        class="w-full bg-cbre-green text-white px-8 pt-10 pb-8 flex flex-col items-start justify-center relative overflow-hidden shrink-0">

                        <!-- Title & Text -->
                        <div class="relative z-10 w-full mb-6">
                                <h2 class="text-white text-4xl font-financier font-normal tracking-tight mb-0">Web
                                        Location Search</h2>
                        </div>

                        <!-- Search Input (Full Width) -->
                        <div
                                class="w-full bg-white p-1 rounded-none shadow-lg group border border-gray-100 relative z-20">
                                <div class="relative flex items-center w-full">
                                        <input v-model="searchWebText" type="text" name="search" autocomplete="off"
                                                @keyup.enter="onSearchText"
                                                class="w-full py-3 pl-4 pr-12 text-[16px] text-gray-900 bg-transparent focus:outline-none placeholder-gray-400 font-light"
                                                placeholder="Search by Market, Address or Keyword..." />

                                        <!-- Search Icon -->
                                        <div class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-2 text-cbre-green-800 rounded hover:text-cbre-green transition-colors"
                                                @click="onSearchText">
                                                <IconMagnifier class="w-5 h-5" />
                                        </div>
                                </div>
                        </div>
                        <div class="relative z-10 w-full mb-6">
                                <p class="text-[16px] text-white/80 font-light leading-relaxed max-w-[90%]">
                                        Explore properties and locations across the region.
                                </p>
                        </div>
                </div>

                <!-- Hero Image -->
                <div class="w-full h-[200px] relative">
                        <img src="/images/intelligent-investment-1384x460.webp" class="w-full h-full object-cover"
                                alt="Insights Hero" />
                        <!-- Gradient Overlay -->
                        <div
                                class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50">
                        </div>
                </div>

                <!-- Results Section -->
                <div class="flex flex-col w-full flex-1 px-8 pt-6 overflow-hidden">

                        <!-- Clear Button (Text only if needed) -->
                        <div v-if="searchWebText" class="flex justify-end mb-2 shrink-0">
                                <button @click="onResetKeyword"
                                        class="text-xs text-gray-500 hover:text-red-500 uppercase tracking-wider font-medium">Clear
                                        Text</button>
                        </div>

                        <!-- Geocoder Component -->
                        <div class="flex-1 overflow-y-auto custom-scrollbar">
                                <NavWebGeocoder ref="geocoderRef" />
                        </div>
                </div>

                <!-- Footer / Close Section -->
                <div
                        class="w-full px-8 py-6 flex justify-between items-center bg-cbre-gray-50 border-t border-gray-200">
                        <button @click="onClearPins"
                                class="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors duration-300 group"
                                title="Clear all pins on map">
                                <UIcon name="i-heroicons-trash"
                                        class="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span
                                        class="text-[14px] font-medium border-b border-transparent group-hover:border-red-600 pb-0.5 transition-all">Clear
                                        Pins</span>
                        </button>

                        <button @click="handleClose"
                                class="group flex items-center gap-2 text-gray-600 hover:text-cbre-green-800 transition-colors duration-300">
                                <span
                                        class="text-[14px] font-medium tracking-wide border-b border-transparent group-hover:border-cbre-green-800 pb-0.5 transition-all">Close
                                        Panel</span>
                                <UIcon name="i-heroicons-x-mark"
                                        class="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                </div>
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
        font-size: 12px;
        color: var(--color-primary);
}
</style>
