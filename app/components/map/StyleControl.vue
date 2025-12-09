<template>
        <div ref="mapStyleRef" class="mapStyle mapboxgl-ctrl mapboxgl-ctrl-group"
                :class="isMounting ? 'hidden' : 'block'">
                <button @click="isOpened = !isOpened" class="mapboxgl-ctrl-mapStyle p-2" title="Map Settings">
                        <UIcon v-if="!statusStore.isLoading" name="i-heroicons-map"
                                class="text-[18px] text-black font-bold transform translate-y-1" />
                        <UIcon v-if="statusStore.isLoading" name="i-heroicons-arrow-path"
                                class="text-[18px] animate-spin" />
                </button>

                <button @click="reset()" class="mapboxgl-ctrl-mapStyle p-2" title="Reset Map View">
                        <UIcon v-if="!isResetting" name="i-heroicons-arrow-uturn-left"
                                class="text-[18px] text-black font-bold transform translate-y-1" />
                        <UIcon v-if="isResetting" name="i-heroicons-arrow-path" class="text-[18px] animate-spin" />
                </button>

                <div class="mapboxgl-mapStyle-list min-w-[240px] p-4 bg-white rounded shadow-lg border border-gray-200 absolute top-0 left-14 z-40"
                        :class="isOpened ? 'block' : 'hidden'">
                        <div class="flex flex-col gap-4 ">
                                <div class="flex justify-between items-center">
                                        <label class="font-medium text-lg">Map Style</label>
                                        <USelect v-model="selectedStyleItem" :items="styleItems" value-key="value"
                                                :avatar="styleAvatar" class="min-w-[150px] text-lg"
                                                :ui="{ item: 'font-medium text-lg bg-white tracking-wider hover:bg-cbre-gray-50' }"
                                                @onchange="mapStore.setMapStyleId(selectedStyleItem || '');" />
                                </div>
                                <div class="flex justify-between items-center">
                                        <label class="font-medium text-lg">Language</label>
                                        <USelect v-model="selectedLangItem" :items="langItems" value-key="value"
                                                :avatar="langAvatar" class="min-w-[150px] text-lg"
                                                :ui="{ item: 'font-medium text-lg bg-white tracking-wider hover:bg-cbre-gray-50' }" />
                                </div>
                                <div class="flex flex-col gap-2">
                                        <label class="font-medium text-lg">Pitch ({{ mapStore.mapPitch }})</label>
                                        <USlider v-model="mapStore.mapPitch" :min="0" :max="85" />
                                </div>
                                <div class="flex flex-col gap-2">
                                        <label class="font-medium text-lg">Bearing ({{ mapStore.mapBearing }})</label>
                                        <USlider v-model="mapStore.mapBearing" :min="0" :max="360" />
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';
import { useMapStore } from '~/stores/map';
import { useStatusStore } from '~/stores/status';
import { MapStyleOptions, MapLangOptions, mapCenter, mapZoom, mapPitch, mapBearing } from '~/context/mapData';

const mapStore = useMapStore();
const statusStore = useStatusStore();
const mapStyleRef = ref<HTMLElement | null>(null);
const isOpened = ref(false);
const isResetting = ref(false);
const isMounting = ref(true);

import type { SelectItem } from '@nuxt/ui'
import type { MapOptionStyle } from '~/types/map.type';




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

const onChangeStyle = (style: MapOptionStyle) => {
        // Defer loading state to allow UI (USelect) to close properly and return focus, 
        // preventing "Blocked aria-hidden" warning from Headless UI.
        setTimeout(() => {
                statusStore.setGlobalLoading(true);
                // Slight delay to allow loader to render before starting heavy map work
                mapStore.setMapStyleId(style.id || '');
        }, 100);
};

const onChangeLanguage = (language: string) => {
        useMapbox('cbre-map', (map) => {
                if (mapStore.mapLanguagePlugin) {
                        map.setStyle(mapStore.mapLanguagePlugin.setLanguage(map.getStyle(), language));
                }
        });
};

const selectedStyleItem = computed({
        get: () => mapStore.selectedMapStyle.id,
        set: (val) => {
                const found = MapStyleOptions.find(opt => opt.id === val);
                if (found) {
                        mapStore.selectedMapStyle = found;
                        onChangeStyle(found);
                }
        }
});

const selectedLangItem = computed({
        get: () => mapStore.selectedMapLanguage.value,
        set: (val) => {
                const found = MapLangOptions.find(opt => opt.value === val);
                if (found) {
                        mapStore.selectedMapLanguage = found;
                        onChangeLanguage(val);
                }
        }
});

const styleItems = computed(() => MapStyleOptions satisfies SelectItem[]);
const langItems = computed(() => MapLangOptions satisfies SelectItem[]);

const styleAvatar = computed(() => styleItems.value.find(item => item.value === selectedStyleItem.value)?.avatar);
const langAvatar = computed(() => langItems.value.find(item => item.value === selectedLangItem.value)?.avatar);

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
