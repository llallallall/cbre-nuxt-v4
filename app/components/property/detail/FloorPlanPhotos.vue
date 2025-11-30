<template>
        <div id="floor-plan-section" class="font-financier text-2xl text-primary mb-[20px]">
                Floor Plan
        </div>

        <ul
                class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-2 ">
                <li class="flex items-center">
                        <div class="relative w-full max-h-[600px] p-4 select-none">
                                <div
                                        class="absolute h-[30px] top-0 left-0 pl-[16px] font-financier text-xl text-primary z-10 ">
                                        Logitudinal Section
                                </div>

                                <div v-if="longitudinalPhotos.length > 0" class="flex-1 flex flex-col mt-[30px]">
                                        <PropertyImageSlide :images="(longitudinalPhotos as any[])" />
                                </div>
                                <div v-else class="mt-[50px] text-gray-400 text-sm italic">
                                        No image available
                                </div>
                        </div>
                </li>

                <li class="flex items-center">
                        <div class="relative w-full max-h-[600px] p-4 select-none">
                                <div
                                        class="absolute h-[30px] top-0 left-0 pl-[20px] font-financier text-xl text-primary z-10">
                                        Cross Section
                                </div>

                                <div v-if="crossPhotos.length > 0" class="mt-[30px] flex-1 flex flex-col">
                                        <PropertyImageSlide :images="(crossPhotos as any[])" />
                                </div>
                                <div v-else class="mt-[50px] text-gray-400 text-sm italic">
                                        No image available
                                </div>
                        </div>
                </li>
        </ul>

        <div class="w-full">
                <button @click="isFloorPlanOpen = !isFloorPlanOpen"
                        class="relative flex justify-between gap-3 w-full p-4 py-2 pr-0 select-none bg-transparent border-none cursor-pointer">
                        <div class="w-1/2 flex justify-start pl-[20px] font-financier text-xl text-primary ">
                                Each Floor Plan
                                <UIcon :name="isFloorPlanOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                        class="ml-2 w-5 h-5" />
                        </div>

                        <div class="w-1/2 flex justify-end">
                                <div
                                        class="bg-primary/10 hover:bg-primary/25 text-primary rounded-full px-4 py-1 min-w-[100px] flex justify-center items-center">
                                        {{ upperFloors.length + basementFloors.length }}
                                </div>
                        </div>
                </button>

                <div v-show="isFloorPlanOpen" class="w-full font-calibreLight text-lg text-primary ">
                        <ul
                                class="w-full font-calibreLight text-lg text-primary gap-10 grid grid-cols-2 lg:grid-cols-2 3xl:grid-cols-2">

                                <li v-if="upperFloors.length > 0" v-for="(floor, index) in upperFloors"
                                        :key="'up-' + index" class="relative flex items-center ml-8">
                                        <div
                                                class="relative w-full max-h-[500px] flex justify-center select-none bg-gray-200/25 ">
                                                <div
                                                        class="absolute h-[30px] top-0 left-0 pl-[20px] font-financier text-xl text-primary z-10">
                                                        {{ formatFloorType(floor.type) }} {{ floor.floor }} F
                                                </div>
                                                <div class="absolute top-0 right-0 text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75 cursor-pointer p-2"
                                                        @click="() => { if (floor.fileUrl) { currentImgUrl = floor.fileUrl; open(); } }">
                                                        <UIcon name="i-heroicons-arrows-pointing-out" class="w-6 h-6" />
                                                </div>
                                                <div class="mt-[30px] flex-1 flex flex-col">
                                                        <img :src="floor.fileUrl || ''"
                                                                class="object-contain w-[calc(100%-2.5rem)] max-h-[500px] p-5 pt-10" />
                                                </div>
                                        </div>
                                </li>

                                <li v-if="basementFloors.length > 0" v-for="(floor, index) in basementFloors"
                                        :key="'base-' + index" class="relative flex items-center ml-8">
                                        <div
                                                class="relative w-full max-h-[500px] flex justify-center select-none bg-gray-200/25 ">
                                                <div
                                                        class="absolute h-[30px] top-0 left-0 pl-[20px] font-financier text-xl text-primary z-10">
                                                        {{ formatFloorType(floor.type) }} {{ floor.floor }} F
                                                </div>
                                                <div class="absolute top-0 right-0 text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75 cursor-pointer p-2"
                                                        @click="() => { if (floor.fileUrl) { currentImgUrl = floor.fileUrl; open(); } }">
                                                        <UIcon name="i-heroicons-arrows-pointing-out" class="w-6 h-6" />
                                                </div>
                                                <div class="mt-[30px] flex-1 flex flex-col">
                                                        <img :src="floor.fileUrl || ''"
                                                                class="object-contain w-[calc(100%-2.5rem)] max-h-[500px] p-5 pt-10" />
                                                </div>
                                        </div>
                                </li>

                        </ul>
                </div>
        </div>

        <UModal v-model="isModalOpen" fullscreen>
                <div class="relative w-full h-full bg-black flex items-center justify-center">
                        <button @click="isModalOpen = false"
                                class="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
                                <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
                        </button>
                        <img :src="currentImgUrl" class="max-w-full max-h-full object-contain" />
                </div>
        </UModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FloorFlanTypeEnum as FloorTypeDefinition, FloorPlanFileType } from '~/types/property.type';

const FloorFlanTypeEnum = {
        LOGITUDINALSECTION: 'LOGITUDINALSECTION',
        CROSSSECTION: 'CROSSSECTION',
        UPPERSECTION: 'UPPERSECTION',
        BASEMENTSECTION: 'BASEMENTSECTION',
} as const;

const props = defineProps<{
        floorPlanFile: FloorPlanFileType[] | null | undefined
}>();

// 💡 1. 원본 파일 리스트 (Flat Array)
// DB에서 property.floorPlanFile은 배열로 옵니다.
const files = computed(() => props.floorPlanFile || []);

// 💡 2. Enum을 사용하여 그룹별로 필터링 (Computed)
const longitudinalPhotos = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.LOGITUDINALSECTION));
const crossPhotos = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.CROSSSECTION));
const upperFloors = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.UPPERSECTION));
const basementFloors = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.BASEMENTSECTION));

// Enum 값 포맷팅 헬퍼
const formatFloorType = (type: string) => {
        if (type === FloorFlanTypeEnum.UPPERSECTION) return 'UPPER';
        if (type === FloorFlanTypeEnum.BASEMENTSECTION) return 'BASEMENT';
        return type;
};

// 모달 관련 로직
const currentImgUrl = ref('');
const isModalOpen = ref(false);
const isFloorPlanOpen = ref(true);

const open = () => {
        isModalOpen.value = true;
};
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>