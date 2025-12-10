<template>
        <div ref="mapSelectionRef" class="mapSelection mapboxgl-ctrl mapboxgl-ctrl-group"
                :class="isMounting ? 'hidden' : 'block'">
                <button @click="togglePins()" class="mapboxgl-ctrl-mapSelection p-2" title="Toggle Filtered Pins">
                        <div class="w-full h-full flex justify-center items-center">
                                <div v-if="mapStore.filterMapPins">
                                        <UIcon v-if="!isLoading" name="i-heroicons-star-solid"
                                                class="text-cbre-green transform translate-y-1" size="20px"
                                                bold="true" />
                                        <UIcon v-if="isLoading" name="i-heroicons-arrow-path"
                                                class="animate-spin transform translate-y-1" size="20px" bold="true" />
                                </div>
                                <div v-else>
                                        <UIcon v-if="!isLoading" name="i-heroicons-star" class="transform translate-y-1"
                                                size="20px" bold="true" />
                                        <UIcon v-if="isLoading" name="i-heroicons-arrow-path"
                                                class="animate-spin transform translate-y-1" size="20px" bold="true" />
                                </div>
                        </div>
                </button>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';
import { useMapStore } from '~/stores/map';

const mapStore = useMapStore();
const mapSelectionRef = ref<HTMLElement | null>(null);
const isMounting = ref(true);
const isLoading = ref(false);

const togglePins = () => {
        isLoading.value = true;
        setTimeout(() => {
                mapStore.filterMapPins = !mapStore.filterMapPins;
                isLoading.value = false;
        }, 300);
};

onMounted(() => {
        isMounting.value = true;
        useMapbox('cbre-map', (map) => {
                if (mapSelectionRef.value) {
                        const control = defineMapboxControl((_map) => {
                                return mapSelectionRef.value as HTMLElement;
                        }, (map) => { });
                        map.addControl(control, "top-right");
                }
        });
        setTimeout(() => { isMounting.value = false; }, 1000);
});
</script>

<style scoped>
.mapSelection {
        position: relative;
}
</style>
