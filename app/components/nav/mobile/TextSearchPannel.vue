<template>
        <div class="flex flex-col w-full h-full z-20 bg-white py-4 px-6">
                <div class="w-full relative flex items-center">
                        <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-cbre-green mr-3" />

                        <input v-model="searchKeyword" type="text" @keyup.enter="onSearchText"
                                class="w-full h-12 text-2xl font-calibre text-cbre-green-900 placeholder-cbre-green-900/40 focus:outline-none bg-transparent"
                                placeholder="Search properties..." autofocus />

                        <button v-if="searchKeyword" @click="searchKeyword = ''" class="ml-2 focus:outline-none">
                                <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-gray-400" />
                        </button>
                </div>

                <div class="w-full h-px bg-cbre-green mt-2"></div>

                <!-- Optional: Add Recent Searches or Suggestions here later -->
                <div class="mt-8">
                        <button @click="emit('isClosed', true)"
                                class="text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-cbre-green-800">
                                Close Search
                        </button>
                </div>
        </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePropertyStore } from '~/stores/property';

// 💡 Store 교체: FilterStore -> PropertyStore
const propertyStore = usePropertyStore();
const { searchKeyword } = storeToRefs(propertyStore);

const emit = defineEmits(['isClosed']);

// 💡 검색 로직 구현
const onSearchText = () => {
        // 검색어 변경 시 필터 적용 액션 호출
        propertyStore.applyFilter();

        // 모바일 환경 등에서 검색 후 패널을 닫음
        emit('isClosed', true);
};
</script>

<style scoped></style>
