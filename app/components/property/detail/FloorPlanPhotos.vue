<template>
        <UAccordion :items="accordionItems" default-value="floor-plans" class="bg-white">
                <template #default="{ open }">
                        <div class="w-full flex items-center justify-between py-3">
                                <div class="text-left flex items-center">
                                        <h3
                                                class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">
                                                {{ $t('nav.anchor.floorplans') }}</h3>
                                        <div
                                                class="ml-4 bg-cbre-green/10 text-cbre-green rounded-full px-4 py-1 min-w-[60px] flex justify-center items-center text-sm font-bold">
                                                {{ files ? files.length : 0 }}
                                        </div>
                                </div>
                                <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                        class="w-5 h-5 ms-auto transform transition-transform duration-200" />
                        </div>
                </template>

                <template #content="scope">
                        <div class="w-full font-calibreLight cbre-text-body-lg text-cbre-green p-4">
                                <!-- Longitudinal Section -->
                                <div v-if="longitudinalPhotos.length > 0" class="mb-8">
                                        <h3 class="cbre-text-display-3 mb-4">{{ $t('property.detail.floorplans.longitudinal') }}
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
                                        <h3 class="cbre-text-display-3 mb-4">{{ $t('property.detail.floorplans.cross') }}</h3>
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
                                        <h3 class="cbre-text-display-3 mb-4">{{ $t('property.detail.floorplans.upper') }}</h3>
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
                                        <h3 class="cbre-text-display-3 mb-4">{{ $t('property.detail.floorplans.basement') }}</h3>
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

                                <div v-if="files.length === 0" class="py-10 text-center text-cbre-blue text-base italic">
                                        {{ $t('common.no_data_found') }}
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

    const { t } = useI18n();

    const accordionItems = computed(() => [{ label: t('property.detail.floorplans.details'), value: 'floor-plans', slot: 'content' }]);

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
        if (type === FloorFlanTypeEnum.UPPERSECTION) return t('property.detail.floorplans.upper_label');
        if (type === FloorFlanTypeEnum.BASEMENTSECTION) return t('property.detail.floorplans.basement_label');
        return type;
    };

const openViewer = (url: string) => {
        statusStore.openViewerModal(url, 'image');
};
</script>

