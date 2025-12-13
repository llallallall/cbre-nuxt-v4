<template>
        <div class="absolute z-30" :class="positionClasses">
                <UTooltip :text="$t('tooltip.filter_pins')" :popper="{ placement: 'right' }">
                        <UButton color="neutral" variant="outline"
                                class="bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-100 w-[3.0rem] h-[3.0rem] flex items-center justify-center p-0"
                                :loading="isLoading"
                                @click="togglePins">
                                <template #leading>
                                        <UIcon :name="mapStore.filterMapPins ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                                                class="w-5 h-5"
                                                :class="mapStore.filterMapPins ? 'text-yellow-500' : 'text-gray-500 hover:text-black'" />
                                </template>
                        </UButton>
                </UTooltip>
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
