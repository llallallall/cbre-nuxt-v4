<template>
    <CommonModal :model-value="modelValue" title="Brochures" @update:model-value="emit('update:modelValue', $event)" @close="emit('closed')">
         <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-auto">
            <div v-for="file in brochures" :key="file.id" @click="openPdf(file.fileUrl)"
                class="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[10px] text-gray-700 font-medium transition flex items-center gap-2 group cursor-pointer">
                <UIcon name="i-heroicons-book-open"
                    class="text-cbre-green w-5 h-5 group-hover:scale-110 transition-transform" />
                <span class="truncate">{{ file.fileName || 'Brochure' }}</span>
            </div>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
import { useStatusStore } from '~/stores/status'

// Define interface locally if not available globally yet, or import it
import type { PropertyBrochureFileType } from '~/types/property.type';

const props = defineProps<{
        modelValue: boolean;
        brochures: PropertyBrochureFileType[];
}>();

const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
        (e: 'closed'): void;
}>();

const statusStore = useStatusStore();

const handleClose = () => {
        emit('update:modelValue', false);
};

const openPdf = (url: string | null) => {
        if (url) {
                statusStore.openViewerModal(url, 'pdf');
        }
};
</script>
