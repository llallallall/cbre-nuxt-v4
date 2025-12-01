<template>
        <div ref="mapStyleRef" class="mapStyle mapboxgl-ctrl mapboxgl-ctrl-group"
                :class="isMounting ? 'hidden' : 'block'">
                <button @click="isOpened = !isOpened" class="mapboxgl-ctrl-mapStyle p-2" title="Map Settings">
                        <UIcon v-if="!isLoading" name="i-heroicons-map" class="w-5 h-5" />
                        <UIcon v-if="isLoading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                </button>

                <button @click="reset()" class="mapboxgl-ctrl-mapStyle p-2" title="Reset Map View">
                        <UIcon v-if="!isResetting" name="i-heroicons-arrow-uturn-left" class="w-5 h-5" />
                        <UIcon v-if="isResetting" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                </button>

                <div class="mapboxgl-mapStyle-list min-w-[300px] p-4 bg-white rounded shadow-lg border border-gray-200 absolute top-0 left-12 z-50"
                        :class="isOpened ? 'block' : 'hidden'">

                        <div class="flex flex-col gap-4">
                                <div class="flex justify-between items-center">
                                        <label class="text-sm font-medium">Map Style</label>
                                        <USelect v-model="mapStore.mapStyleOptions.MapStyle" :options="MapStyle"
                                                option-attribute="name"
                                                @change="onChangeStyle(mapStore.mapStyleOptions.MapStyle.value); isOpened = false" />
                                </div>
                                <div class="flex justify-between items-center">
                                        <label class="text-sm font-medium">Language</label>
                                        <USelect v-model="mapStore.mapStyleOptions.MapLang" :options="MapLang"
                                                option-attribute="name"
                                                @change="onChangeLanguage(mapStore.mapStyleOptions.MapLang.value); isOpened = false" />
                                </div>
                                <div class="flex flex-col gap-2">
                                        <label class="text-sm font-medium">Pitch ({{ mapStore.mapStyleOptions.MapPitch
                                                }})</label>
                                        <URange v-model="mapStore.mapStyleOptions.MapPitch" :min="0" :max="85" />
                                </div>
                                <div class="flex flex-col gap-2">
                                        <label class="text-sm font-medium">Bearing ({{
                                                mapStore.mapStyleOptions.MapBearing }})</label>
                                        <URange v-model="mapStore.mapStyleOptions.MapBearing" :min="0" :max="360" />
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';
import { useMapStore } from '~/stores/map';
import { MapStyle, MapLang, mapCenter, mapZoom, mapPitch, mapBearing } from '~/context/mapData';

const mapStore = useMapStore();
const mapStyleRef = ref<HTMLElement | null>(null);
const isOpened = ref(false);
const isLoading = ref(false);
const isResetting = ref(false);
const isMounting = ref(true);

const reset = () => {
        isResetting.value = true;
        useMapbox('cbre-map', (map) => {
                map.setCenter(mapCenter);
                map.setZoom(mapZoom);
                map.setPitch(mapPitch);
                map.setBearing(mapBearing);
        });
        setTimeout(() => { isResetting.value = false; }, 1000);
};

const onChangeStyle = (tileStyle: string) => {
        isLoading.value = true;
        useMapbox('cbre-map', (map) => {
                map.setStyle(tileStyle);
        });
        setTimeout(() => { isLoading.value = false; }, 1000);
};

const onChangeLanguage = (language: string) => {
        useMapbox('cbre-map', (map) => {
                if (mapStore.mapLanguage) {
                        map.setStyle(mapStore.mapLanguage.setLanguage(map.getStyle(), language));
                }
        });
};

onMounted(() => {
        isMounting.value = true;
        useMapbox('cbre-map', (map) => {
                if (mapStyleRef.value) {
                        const control = defineMapboxControl((_map) => mapStyleRef.value as HTMLElement, (map) => { });
                        map.addControl(control, "top-left");
                }
        });
        setTimeout(() => { isMounting.value = false; }, 1000);
});
</script>

<style scoped>
.mapStyle {
        position: relative;
}
</style>
