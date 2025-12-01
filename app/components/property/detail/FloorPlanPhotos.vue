<template>
        <div id="floor-plan-section" class="font-financier text-2xl text-cbre-green mb-[20px]">
                Floor Plan
        </div>

        <UAccordion :items="accordionItems" class="bg-white mb-[20px] border-t border-gray-200">
                <template #default="{ open }">
                        <UButton color="neutral" variant="ghost"
                                class="border-b border-gray-200 dark:border-gray-700 rounded-none p-3">
                                <template #leading>
                                        <div class="w-full text-left">
                                                <span class="font-financier text-xl text-cbre-green">Floor Plan
                                                        Photos</span>
                                        </div>
                                </template>
                                <template #trailing>
                                        <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                                class="w-5 h-5 ms-auto transform transition-transform duration-200" />
                                </template>
                        </UButton>
                </template>

                <template #content="scope">
                        <div class="w-full font-calibreLight text-lg text-cbre-green p-4">
                                <!-- Longitudinal Section -->
                                <div v-if="longitudinalPhotos.length > 0" class="mb-8">
                                        <h3 class="font-financier text-xl text-cbre-green mb-4">Longitudinal Section
                                        </h3>
                                        <div class="grid grid-cols-2 gap-4">
                                                <div v-for="(photo, index) in longitudinalPhotos" :key="'long-' + index"
                                                        class="relative">
                                                        <img :src="photo.fileUrl || ''"
                                                                class="object-contain w-full max-h-[300px] border border-gray-200 cursor-pointer hover:opacity-90"
                                                                @click="() => { if (photo.fileUrl) openViewer(photo.fileUrl) }" />
                                                </div>
                                        </div>
                                </div>

                                <!-- Cross Section -->
                                <div v-if="crossPhotos.length > 0" class="mb-8">
                                        <h3 class="font-financier text-xl text-cbre-green mb-4">Cross Section</h3>
                                        <div class="grid grid-cols-2 gap-4">
                                                <div v-for="(photo, index) in crossPhotos" :key="'cross-' + index"
                                                        class="relative">
                                                        <img :src="photo.fileUrl || ''"
                                                                class="object-contain w-full max-h-[300px] border border-gray-200 cursor-pointer hover:opacity-90"
                                                                @click="() => { if (photo.fileUrl) openViewer(photo.fileUrl) }" />
                                                </div>
                                        </div>
                                </div>

                                <!-- Upper Floors -->
                                <div v-if="upperFloors.length > 0" class="mb-8">
                                        <h3 class="font-financier text-xl text-cbre-green mb-4">Upper Floors</h3>
                                        <div class="grid grid-cols-2 gap-4">
                                                <div v-for="(floor, index) in upperFloors" :key="'up-' + index"
                                                        class="relative">
                                                        <div class="mb-2">{{ formatFloorType(floor.type) }} {{
                                                                floor.floor }}F</div>
                                                        <img :src="floor.fileUrl || ''"
                                                                class="object-contain w-full max-h-[300px] border border-gray-200 cursor-pointer hover:opacity-90"
                                                                @click="() => { if (floor.fileUrl) openViewer(floor.fileUrl) }" />
                                                </div>
                                        </div>
                                </div>

                                <!-- Basement Floors -->
                                <div v-if="basementFloors.length > 0" class="mb-8">
                                        <h3 class="font-financier text-xl text-cbre-green mb-4">Basement Floors</h3>
                                        <div class="grid grid-cols-2 gap-4">
                                                <div v-for="(floor, index) in basementFloors" :key="'base-' + index"
                                                        class="relative">
                                                        <div class="mb-2">{{ formatFloorType(floor.type) }} {{
                                                                floor.floor }}F</div>
                                                        <img :src="floor.fileUrl || ''"
                                                                class="object-contain w-full max-h-[300px] border border-gray-200 cursor-pointer hover:opacity-90"
                                                                @click="() => { if (floor.fileUrl) openViewer(floor.fileUrl) }" />
                                                </div>
                                        </div>
                                </div>

                                <div v-if="files.length === 0" class="text-center text-gray-500">
                                        No floor plan photos available.
                                </div>
                        </div>
                </template>
        </UAccordion>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatusStore } from '~/stores/status';
import type { FloorPlanFileType } from '~/types/property.type';

const FloorFlanTypeEnum = {
        LOGITUDINALSECTION: 'LOGITUDINALSECTION',
        CROSSSECTION: 'CROSSSECTION',
        UPPERSECTION: 'UPPERSECTION',
        BASEMENTSECTION: 'BASEMENTSECTION',
} as const;

const accordionItems = [{ label: 'Floor Plan Details', defaultOpen: true, slot: 'content' }];

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