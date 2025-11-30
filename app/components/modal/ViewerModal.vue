<template>
    <UModal v-model="isOpen">
        <div class="p-4 h-[80vh] w-full sm:max-w-5xl flex flex-col">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-primary">Viewer</h3>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
            </div>

            <div class="flex-1 overflow-auto bg-gray-100 flex justify-center items-center rounded-lg relative">
                <template v-if="viewerType === 'pdf'">
                    <iframe v-if="viewerUrl" :src="viewerUrl" class="w-full h-full" frameborder="0"></iframe>
                    <div v-else class="text-gray-500">No PDF URL provided</div>
                </template>

                <template v-else-if="viewerType === 'image'">
                    <img v-if="viewerUrl" :src="viewerUrl" alt="Preview" class="max-w-full max-h-full object-contain" />
                    <div v-else class="text-gray-500">No Image URL provided</div>
                </template>

                <div v-else class="text-gray-500">
                    Unsupported viewer type: {{ viewerType }}
                </div>
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatusStore } from '~/stores/status';

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
