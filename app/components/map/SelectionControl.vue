<template>
        <div class="absolute z-50" :class="positionClasses">
                <UButton color="neutral" variant="outline"
                        class="bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-100"
                        :class="mapStore.filterMapPins ? 'p-3' : 'p-4'" :loading="isLoading" @click="togglePins">
                        <template #leading>
                                <UIcon :name="mapStore.filterMapPins ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                                        class="w-5 h-5 text-2xl font-bold"
                                        :class="mapStore.filterMapPins ? 'text-yellow-500' : 'shadow-md bg-white font-[1100] rounded-none text-2xl text-black/50 hover:text-opacity-100 hover:text-black'" />
                        </template>
                        <span v-if="mapStore.filterMapPins" class="text-2xl text-yellow-500 font-medium pr-1">
                                Filtered
                        </span>
                </UButton>
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMapStore } from '~/stores/map';

const props = withDefaults(defineProps<{
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>(), {
        position: 'top-left'
});

const positionClasses = computed(() => {
        switch (props.position) {
                case 'top-left': return 'top-4 left-4';
                case 'top-right': return 'top-4 right-4';
                case 'bottom-left': return 'bottom-8 left-4';
                case 'bottom-right': return 'bottom-8 right-4';
                default: return 'top-4 left-4';
        }
});

const mapStore = useMapStore();
const isLoading = ref(false);

const togglePins = () => {
        isLoading.value = true;
        // Simulate delay or wait for store action
        setTimeout(() => {
                mapStore.filterMapPins = !mapStore.filterMapPins;
                isLoading.value = false;
        }, 300);
};
</script>

<style scoped></style>
