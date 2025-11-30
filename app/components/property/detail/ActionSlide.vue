<template>
        <div class="w-full flex flex-col sm:flex-row items-center justify-between">

                <div class="addresses w-full sm:w-1/2 mb-2 flex flex-col text-base relative">
                        <div v-if="location && location.addressProvince"
                                class="address font-barlow text-gray-400 w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ location.addressProvince }}
                                        <span v-if="location && location.addressCity"> / {{
                                                location.addressCity }}</span>
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
                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer"
                                @click="scrollToSection('floor-plan-section')">
                                <UIcon name="i-heroicons-document-text" class="text-primary w-[20px] h-[20px]" />
                                Floor Plan
                        </div>

                        <div class="action-buttons bg-primary/10 text-primary rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 transition-all"
                                :class="[hasBrochure ? 'hover:bg-primary/25 cursor-pointer' : 'opacity-50 cursor-pointer']"
                                @click="downloadAsPdf()">
                                <UIcon name="i-heroicons-book-open" class="text-primary w-[20px] h-[20px]" />
                                Brochure
                        </div>

                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer"
                                @click="scrollToSection('location-map-section')">
                                <UIcon name="i-heroicons-map" class="text-primary w-[20px] h-[20px]" />
                                Map
                        </div>
                </div>

        </div>

        <div class="image-slide w-full h-[500px] select-none mt-2 relative">
                <img :src="mainImageUrl" class="object-cover w-full h-full relative" />

                <div v-if="validImages.length > 0"
                        class="small-previews w-full h-[100px] flex justify-center items-end gap-3 z-10 absolute bottom-[10px]">
                        <div v-for="preview in validImages" :key="preview.id"
                                class="preview overflow-hidden w-[50px] h-[50px] border-white/25 border-4 shadow-xl hover:scale-125 transition-all cursor-pointer">
                                <img v-if="preview.fileUrl" :src="preview.fileUrl" @click="setImageSrc(preview.fileUrl)"
                                        class="object-cover w-full h-full border-white/25 border-2" />
                        </div>
                </div>

                <div class="expand-icon absolute top-0 right-0 p-2 text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75 cursor-pointer"
                        @click="openModal">
                        <UIcon name="i-heroicons-arrows-pointing-out" class="w-6 h-6" />
                </div>
        </div>

        <!-- Fullscreen Image Modal -->
        <UModal v-model="isImageModalOpen" fullscreen>
                <div class="relative w-full h-full bg-black flex items-center justify-center">
                        <button @click="isImageModalOpen = false"
                                class="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
                                <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
                        </button>
                        <img :src="currentImgUrl" class="max-w-full max-h-full object-contain" />
                </div>
        </UModal>

        <!-- Brochure List Modal -->
        <UModal v-model="isBrochureModalOpen">
                <div class="p-6">
                        <h3 class="text-lg font-bold mb-4">Select Brochure</h3>
                        <ul class="space-y-2">
                                <li v-for="brochure in props.brochure" :key="brochure.id"
                                        class="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        @click="openBrochure(brochure)">
                                        <span>{{ brochure.fileName || 'Brochure' }}</span>
                                        <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-gray-500" />
                                </li>
                        </ul>
                        <div class="mt-4 flex justify-end">
                                <button @click="isBrochureModalOpen = false"
                                        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                        </div>
                </div>
        </UModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFormat } from '~/composables/useFormat';
import type { LocationType, PropertyImageFileType, PropertyBrochureFileType } from '~/types/property.type';
import { useStatusStore } from '~/stores/status';

// Props 정의
const props = defineProps<{
        location: LocationType | null | undefined;
        images: PropertyImageFileType[] | null | undefined;
        brochure: PropertyBrochureFileType[] | null | undefined;
}>();

const statusStore = useStatusStore();
const { showToast } = useAppToast();

const { getThumbnailUrl } = useFormat();

// 💡 이미지 데이터 처리
const validImages = computed(() => {
        if (!props.images) return [];
        return props.images.filter((el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0);
});

// 현재 표시할 이미지 URL
const currentImgUrl = ref('');
const isImageModalOpen = ref(false);
const isBrochureModalOpen = ref(false);

// 초기 이미지 설정
if (validImages.value.length > 0 && validImages.value[0]) {
        currentImgUrl.value = validImages.value[0].fileUrl || '';
} else {
        currentImgUrl.value = '/images/placeholder.jpg';
}

const mainImageUrl = computed(() => currentImgUrl.value || '/images/placeholder.jpg');

const setImageSrc = (src: string | null) => {
        if (src) currentImgUrl.value = src;
};

const hasBrochure = computed(() => props.brochure && props.brochure.length > 0);

const openBrochure = (brochureFile: PropertyBrochureFileType) => {
        const pdfUrl = brochureFile?.fileUrl;
        if (pdfUrl) {
                statusStore.openViewerModal(pdfUrl, 'pdf');
                isBrochureModalOpen.value = false;
        } else {
                showToast('Invalid file URL', 'danger');
        }
};

const downloadAsPdf = () => {
        const brochures = props.brochure || [];

        if (brochures.length === 0) {
                showToast('No brochure file registered', 'danger');
                return;
        }

        if (brochures.length === 1 && brochures[0]) {
                openBrochure(brochures[0]);
                return;
        }

        // Multiple files
        isBrochureModalOpen.value = true;
};

// 💡 스크롤 이동 함수
const scrollToSection = (elementId: string) => {
        const el = document.getElementById(elementId);
        if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
        } else {
                console.warn(`Element with id ${elementId} not found.`);
        }
};

const openModal = () => {
        isImageModalOpen.value = true;
};

</script>

<style scoped>
.image-slide {
        position: relative;
}

.small-previews {
        /* position: absolute; bottom: 10px; handled by tailwind classes now */
        display: flex;
        flex-direction: row;
        justify-content: center;
}

.preview {
        display: inline-block;
        width: 120px;
        height: 90px;
        margin: 4px;
}

.expand-icon {
        /* position: absolute; top: 0; right: 0; padding: 8px; handled by tailwind */
}
</style>
