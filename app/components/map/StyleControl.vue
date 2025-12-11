<template>
        <div class="absolute z-30 flex flex-col gap-4" :class="positionClasses">
                <!-- Settings Toggle Button -->
                <UTooltip :text="$t('tooltip.toggle_settings')" :popper="{ placement: 'right' }">
                        <UButton color="neutral" variant="outline"
                                class="shadow-md bg-white rounded-none font-[1100] text-2xl text-black/50 hover:text-opacity-100 hover:text-black p-4"
                                icon="i-heroicons-cog-6-tooth" @click="isOpened = !isOpened" />
                </UTooltip>

                <!-- Reset Button -->
                <UTooltip :text="$t('tooltip.reset_view')" :popper="{ placement: 'right' }">
                        <UButton v-if="!isResetting" color="neutral" variant="outline"
                                class="shadow-md bg-white rounded-none font-[1100] text-2xl text-black/50 hover:text-opacity-100 hover:text-black p-4"
                                icon="i-heroicons-arrow-uturn-left" @click="onReset" />
                        <UButton v-else loading color="neutral" variant="outline"
                                class="p-4 text-center text-2xl shadow-md bg-white rounded-none" />
                </UTooltip>

                <!-- Settings Panel -->
                <div v-if="isOpened"
                        class="absolute top-[0rem] left-[4rem] w-[20rem] bg-white rounded-none shadow-xl border border-gray-200 p-4 space-y-4">

                        <!-- Map Style Selector -->
                        <div class="flex items-center justify-between">
                                <label class="font-medium text-gray-700 text-2xl whitespace-nowrap pr-4">Map
                                        Style</label>
                                <UDropdownMenu :items="styleItems" :ui="{ content: 'w-[15rem] text-2xl ' }">
                                        <UButton color="neutral" variant="outline" block
                                                class="justify-between ring-1 ring-gray-200 bg-gray-50">
                                                <div class="flex items-center gap-2 text-gray-700 text-2xl w-full">
                                                        <img v-if="selectedStyle?.avatar"
                                                                :src="selectedStyle.avatar.src"
                                                                class="w-5 h-5 rounded-sm object-cover" />
                                                        <span>{{ selectedStyle?.label }}</span>
                                                </div>
                                                <UIcon name="i-heroicons-chevron-down-20-solid" class="text-gray-400" />
                                        </UButton>

                                        <template #item="{ item }">
                                                <div class="flex w-full items-center gap-3 py-1 hover:bg-gray-100">
                                                        <img v-if="item.avatar" :src="item.avatar.src"
                                                                class="w-8 h-8 rounded-none border border-gray-200 object-cover" />
                                                        <span class=" text-2xl font-medium text-gray-700">{{
                                                                item.label
                                                                }}</span>
                                                </div>
                                        </template>
                                </UDropdownMenu>
                        </div>

                        <!-- Language Selector -->
                        <div class="flex items-center justify-between">
                                <label
                                        class="font-medium text-gray-700 text-2xl whitespace-nowrap pr-4">Language</label>
                                <UDropdownMenu :items="langItems" :ui="{ content: 'w-[10rem]' }">
                                        <UButton color="neutral" variant="outline" block
                                                class="justify-between ring-1 ring-gray-200 bg-gray-50">
                                                <div class="flex items-center gap-2">
                                                        <img v-if="selectedLang?.avatar" :src="selectedLang.avatar.src"
                                                                class="w-5 h-5 rounded-sm object-cover" />
                                                        <span class="text-gray-700 text-2xl">{{ selectedLang?.label
                                                                }}</span>
                                                </div>
                                                <UIcon name="i-heroicons-chevron-down-20-solid" class="text-gray-400" />
                                        </UButton>

                                        <template #item="{ item }">
                                                <div class="flex items-center gap-3 w-full py-1">
                                                        <img v-if="item.avatar" :src="item.avatar.src"
                                                                class="w-5 h-5 rounded-sm object-cover" />
                                                        <span class="font-medium  text-gray-700 text-2xl">{{ item.label
                                                        }}</span>
                                                </div>
                                        </template>
                                </UDropdownMenu>
                        </div>

                        <UDivider />

                        <!-- Sliders -->
                        <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                        <div class="flex justify-between text-2xl gap-2 pr-4">
                                                <span class="font-medium text-gray-700">Pitch</span>
                                                <span class="text-gray-500">{{ mapStore.mapPitch }}°</span>
                                        </div>
                                        <USlider v-model="mapStore.mapPitch" :min="0" :max="85" />
                                </div>

                                <div class="flex items-center justify-between gap-4">
                                        <div class="flex justify-start text-2xl gap-2 pr-4">
                                                <span class="font-medium text-gray-700">Bearing</span>
                                                <span class="text-gray-500">{{ mapStore.mapBearing }}°</span>
                                        </div>
                                        <USlider v-model="mapStore.mapBearing" :min="0" :max="360" />
                                </div>
                        </div>

                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMapbox } from '#imports';
import { useMapStore } from '~/stores/map';
import { useStatusStore } from '~/stores/status';
import { MapStyleOptions, MapLangOptions, mapCenter, mapZoom, mapPitch, mapBearing } from '~/context/mapData';

const props = withDefaults(defineProps<{
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>(), {
        position: 'top-left'
});

const positionClasses = computed(() => {
        switch (props.position) {
                case 'top-left': return 'top-4 left-4';
                case 'top-right': return 'top-4 right-4';
                case 'bottom-left': return 'bottom-8 left-4'; // bottom-8 to avoid attribution
                case 'bottom-right': return 'bottom-8 right-4';
                default: return 'top-4 left-4';
        }
});

const mapStore = useMapStore();
const statusStore = useStatusStore();
const { locale } = useI18n(); // Sync with global locale

const isOpened = ref(false);
const isResetting = ref(false);

const selectedStyle = computed(() => mapStore.selectedMapStyle);

const selectedLang = computed(() => {
        // We can allow manual override via store or sync with global locale
        // Here we strictly follow store which follows global locale via watch in Container
        return mapStore.selectedMapLanguage;
});

// Style Options
const styleItems = computed(() => {
        return MapStyleOptions.map(option => ({
                label: option.label,
                avatar: option.avatar,
                id: option.id,
                onSelect: () => {
                        statusStore.setGlobalLoading(true);
                        setTimeout(() => {
                                mapStore.setMapStyleId(option.id);
                                mapStore.selectedMapStyle = option;
                        }, 100);

                }
        }));
});

// Language Options
const langItems = computed(() => {
        return MapLangOptions.map(option => ({
                label: option.label,
                avatar: option.avatar,
                value: option.value,
                onSelect: () => {
                        // ONLY update store, do NOT update global locale
                        // locale.value = option.value; 
                        mapStore.selectedMapLanguage = option;
                }
        }));
});

const onReset = () => {
        isResetting.value = true;
        useMapbox('cbre-map', (map) => {
                map.flyTo({
                        center: mapCenter,
                        zoom: mapZoom,
                        pitch: mapPitch,
                        bearing: mapBearing,
                        essential: true
                });
        });
        // Reset store values as well if they are bound to v-model (sliders)
        mapStore.mapPitch = mapPitch;
        mapStore.mapBearing = mapBearing;

        setTimeout(() => {
                isResetting.value = false;
        }, 1000);
};

// Initial Sync on Mount (only if store is empty or we want to enforce global locale start)
onMounted(() => {
        // When activated, sync with global locale as requested
        const found = MapLangOptions.find(opt => opt.value === locale.value);
        if (found) {
                mapStore.selectedMapLanguage = found;
        }
});
</script>

<style scoped>
/* Ensure panel sits above map */
</style>
