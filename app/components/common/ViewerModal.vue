<template>
    <CommonModal :model-value="isOpen" @update:model-value="closeModal" fullscreen no-padding panel-class="!bg-black/90" hide-close-button>
        <div class="relative w-full h-full flex flex-col group">
            <!-- Custom Close Button -->
            <button type="button" 
                class="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-200 focus:outline-none" 
                @click="closeModal">
                <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
                <span class="sr-only">Close</span>
            </button>

            <!-- Content -->
            <div class="absolute top-0 left-0 flex-1 w-screen h-screen flex items-center justify-center overflow-hidden p-10" @click.self="closeModal">
                <template v-if="viewerType === 'pdf'">
                    <PdfViewer v-if="viewerUrl" :source="viewerUrl" />
                    <div v-else class="text-white">No PDF URL provided</div>
                </template>

                <template v-else-if="viewerType === 'image'">
                    <NuxtImg v-if="viewerUrl" :src="viewerUrl" alt="Preview" fit="contain" class="max-w-full max-h-full shadow-2xl" />
                    <div v-else class="text-white">No Image URL provided</div>
                </template>

                <div v-else class="text-white">
                    Unsupported viewer type: {{ viewerType }}
                </div>
            </div>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatusStore } from '~/stores/status';
import PdfViewer from '~/components/common/PdfViewer.vue';

const statusStore = useStatusStore();

const isOpen = computed({
    get: () => statusStore.isViewerOpen,
    set: (value) => {
        if (!value) statusStore.closeViewerModal();
    }
});

const viewerUrl = computed(() => statusStore.viewerUrl);
const viewerType = computed(() => statusStore.viewerType);

const closeModal = () => {
    statusStore.closeViewerModal();
};
</script>
