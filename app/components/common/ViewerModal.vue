<template>
    <UModal :model-value="isOpen" @update:model-value="closeModal" fullscreen>
        <div class="relative w-full h-full flex flex-col bg-black/90">
            <!-- Header / Close Button -->
            <div class="absolute top-4 right-4 z-50">
                <UButton icon="i-heroicons-x-mark" variant="ghost" class="text-white" @click="closeModal">
                    Close
                </UButton>
            </div>

            <!-- Content -->
            <div class="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
                <template v-if="viewerType === 'pdf'">
                    <PdfViewer v-if="viewerUrl" :source="viewerUrl" />
                    <div v-else class="text-white">No PDF URL provided</div>
                </template>

                <template v-else-if="viewerType === 'image'">
                    <img v-if="viewerUrl" :src="viewerUrl" alt="Preview" class="max-w-full max-h-full object-contain" />
                    <div v-else class="text-white">No Image URL provided</div>
                </template>

                <div v-else class="text-white">
                    Unsupported viewer type: {{ viewerType }}
                </div>
            </div>
        </div>
    </UModal>
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
