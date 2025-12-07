<template>
        <div class="w-full flex flex-col sm:flex-row items-center justify-between">

                <div class="addresses w-full sm:w-1/2 mb-2 flex flex-col text-base relative">
                        <div v-if="location && location.addressProvince"
                                class="address font-barlow text-gray-400 w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ location.addressProvince }}
                                        <span v-if="location && location.addressCity"> / {{ location.addressCity
                                        }}</span>
                                </div>
                        </div>

                        <div v-if="location && location.addressFull"
                                class="address font-barlow text-gray-600 w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ location.addressFull }}
                                </div>
                        </div>
                </div>

                <div
                        class="action-buttons-group w-full sm:w-1/2 flex my-4 sm:my-0 justify-start sm:justify-end items-center gap-3 font-calibre text-base">
                        <div class="action-buttons bg-cbre-green/10 hover:bg-cbre-green/25 text-cbre-green rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer transition-colors"
                                @click="scrollToSection('floor-plan-section')">
                                <UIcon name="i-heroicons-document-text" class="text-cbre-green w-5 h-5" />
                                Floor Plan
                        </div>

                        <div class="action-buttons bg-cbre-green/10 text-cbre-green rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 transition-all"
                                :class="[hasBrochure ? 'hover:bg-cbre-green/25 cursor-pointer' : 'opacity-50 cursor-not-allowed']"
                                @click="downloadAsPdf()">
                                <UIcon name="i-heroicons-book-open" class="text-cbre-green w-5 h-5" />
                                Brochure
                        </div>

                        <div class="action-buttons bg-cbre-green/10 hover:bg-cbre-green/25 text-cbre-green rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer transition-colors"
                                @click="scrollToSection('location-map-section')">
                                <UIcon name="i-heroicons-map" class="text-cbre-green w-5 h-5" />
                                Map
                        </div>
                </div>

        </div>

        <div class="mt-2">
                <ImageSlide :images="validImages" />
        </div>

        <BrochureList v-model="isBrochureModalOpen" :brochures="brochure || []" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStatusStore } from '~/stores/status';
import type { LocationType, PropertyImageFileType, PropertyBrochureFileType } from '~/types/property.type';
import ImageSlide from '~/components/common/ImageSlide.vue';
import BrochureList from '~/components/property/modify/form/BrochureList.vue';

import { useAppToast } from '~/composables/useAppToast';

const props = defineProps<{
        location: LocationType | null | undefined;
        images: PropertyImageFileType[] | null | undefined;
        brochure: PropertyBrochureFileType[] | null | undefined;
}>();

const statusStore = useStatusStore();
const { showToast } = useAppToast();

const validImages = computed(() => {
        if (!props.images) return [];
        return props.images.filter((el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0);
});

const hasBrochure = computed(() => props.brochure && props.brochure.length > 0);
const isBrochureModalOpen = ref(false);

const downloadAsPdf = () => {
        const brochures = props.brochure || [];

        if (brochures.length === 0) {
                showToast('No brochure file registered', 'danger');
                return;
        }

        if (brochures.length === 1) {
                const brochureFile = brochures[0];
                const pdfUrl = brochureFile?.fileUrl;
                if (pdfUrl) {
                        statusStore.openViewerModal(pdfUrl, 'pdf');
                } else {
                        showToast('Invalid file URL', 'danger');
                }
                return;
        }

        // Multiple files
        isBrochureModalOpen.value = true;
};

const scrollToSection = (elementId: string) => {
        const el = document.getElementById(elementId);
        if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
        } else {
                console.warn(`Element with id ${elementId} not found.`);
        }
};
</script>

<style scoped>
.action-buttons {
        transition: all 0.2s ease-in-out;
}
</style>
