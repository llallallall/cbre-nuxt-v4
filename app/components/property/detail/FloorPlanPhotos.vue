<template>
        <div id="floor-plan-section" class="font-financier text-2xl text-cbre-green mb-[20px]">
                Floor Plan
        </div>

        <ul
                class="cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-2 ">
                <li class="flex items-center">
                        <div class="relative w-full max-h-[600px] p-4 select-none">
                                <div
                                        class="absolute h-[30px] top-0 left-0 pl-[16px] font-financier text-xl text-cbre-green z-10 ">
                                        Logitudinal Section
                                </div>

                                <div v-if="longitudinalPhotos.length > 0" class="flex-1 flex flex-col mt-[30px]">
                                        <ImageSlide :images="(longitudinalPhotos as any[])" />
                                </div>
                        </div>
                </li>
        </ul>

        <UAccordion :items="[{ label: 'Each Floor Plan', slot: 'content' }]" default-open
                :ui="{ wrapper: 'w-full', item: { padding: 'pt-0 pb-2' } }">
                <template #default="{ item, open }">
                        <UButton color="neutral" variant="ghost"
                                class="w-full flex justify-between items-center py-2 px-4">
                                <span class="font-financier text-xl text-cbre-green">{{ item.label }}</span>
                                <div class="flex items-center gap-2">
                                        <div
                                                class="bg-cbre-green/10 text-cbre-green rounded-full px-4 py-1 min-w-[100px] flex justify-center items-center font-bold">
                                                {{ upperFloors.length + basementFloors.length }}
                                        </div>
                                        <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                                class="w-5 h-5" />
                                </div>
                        </UButton>
                </template>
                <template #content>
                        <div class="w-full font-calibreLight text-lg text-cbre-green ">
                                <ul
                                        class="w-full font-calibreLight text-lg text-cbre-green gap-10 grid grid-cols-2 lg:grid-cols-2 3xl:grid-cols-2">

                                        <li v-if="upperFloors.length > 0" v-for="(floor, index) in upperFloors"
                                                :key="'up-' + index" class="relative flex items-center ml-8">
                                                <div
                                                        class="relative w-full max-h-[500px] flex justify-center select-none bg-gray-200/25 ">
                                                        <div
                                                                class="absolute h-[30px] top-0 left-0 pl-[20px] font-financier text-xl text-cbre-green z-10">
                                                                {{ formatFloorType(floor.type) }} {{
                                                                        floor.floor }} F
                                                        </div>
                                                        <div class="absolute top-0 right-0 text-cbre-green hover:text-white backdrop-blur-sm bg-white/25 hover:bg-cbre-green/75 cursor-pointer p-2"
                                                                @click="() => { if (floor.fileUrl) openViewer(floor.fileUrl) }">
                                                                <UIcon name="i-heroicons-arrows-pointing-out"
                                                                        class="w-6 h-6" />
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
                                                                class="absolute h-[30px] top-0 left-0 pl-[20px] font-financier text-xl text-cbre-green z-10">
                                                                {{ formatFloorType(floor.type) }} {{
                                                                        floor.floor }} F
                                                        </div>
                                                        <div class="absolute top-0 right-0 text-cbre-green hover:text-white backdrop-blur-sm bg-white/25 hover:bg-cbre-green/75 cursor-pointer p-2"
                                                                @click="() => { if (floor.fileUrl) openViewer(floor.fileUrl) }">
                                                                <UIcon name="i-heroicons-arrows-pointing-out"
                                                                        class="w-6 h-6" />
                                                        </div>
                                                        <div class="mt-[30px] flex-1 flex flex-col">
                                                                <img :src="floor.fileUrl || ''"
                                                                        class="object-contain w-[calc(100%-2.5rem)] max-h-[500px] p-5 pt-10" />
                                                        </div>
                                                </div>
                                        </li>

                                </ul>
                        </div>
                </template>
        </UAccordion>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatusStore } from '~/stores/status';
import type { FloorPlanFileType } from '~/types/property.type';
import ImageSlide from '~/components/property/ImageSlide.vue';

const FloorFlanTypeEnum = {
        LOGITUDINALSECTION: 'LOGITUDINALSECTION',
        CROSSSECTION: 'CROSSSECTION',
        UPPERSECTION: 'UPPERSECTION',
        BASEMENTSECTION: 'BASEMENTSECTION',
} as const;

const props = defineProps<{
        floorPlanFile: FloorPlanFileType[] | null | undefined
}>();

const statusStore = useStatusStore();

const files = computed(() => props.floorPlanFile || []);

const longitudinalPhotos = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.LOGITUDINALSECTION));
const crossPhotos = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.CROSSSECTION));
const upperFloors = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.UPPERSECTION));
const basementFloors = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.BASEMENTSECTION));

const formatFloorType = (type: string) => {
        if (type === FloorFlanTypeEnum.UPPERSECTION) return 'UPPER';
        if (type === FloorFlanTypeEnum.BASEMENTSECTION) return 'BASEMENT';
        return type;
};

const openViewer = (url: string) => {
        statusStore.openViewerModal(url, 'image');
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