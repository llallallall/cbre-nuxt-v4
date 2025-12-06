<template>
    <div class="cbre-panel-card mb-3 cursor-pointer group hover:border-cbre-green transition-colors !p-4"
        @click="handleSelect">

        <div class="flex justify-between items-center mb-2">
            <div
                class="w-[calc(100%-40px)] cbre-text-body-md font-bold truncate group-hover:text-[var(--color-primary-1)]">
                {{ item?.name || item?.place_name }}
            </div>
            <div class="cbre-badge-circle cbre-badge-circle-yellow">
                K
            </div>
        </div>

        <div class="cbre-text-meta flex flex-col gap-1">
            <div v-if="item?.category" class="flex items-center text-[var(--color-primary-1)] font-medium mb-0.5">
                {{ item.category }}
            </div>

            <div v-if="item?.road_address" class="flex items-center">
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                <span class="truncate">{{ item.road_address }}</span>
            </div>

            <div v-else-if="item?.address" class="flex items-center">
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                <span class="truncate">{{ item.address }}</span>
            </div>

            <div class="flex items-center mt-1 opacity-70">
                <UIcon name="i-heroicons-map-pin" class="w-3 h-3 mr-1" />
                <span>{{ item?.latitude }}, {{ item?.longitude }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map';

const props = defineProps<{
    item: {
        name?: string;
        place_name?: string;
        category?: string;
        address?: string;
        road_address?: string;
        latitude: number | string;
        longitude: number | string;
        [key: string]: any;
    }
}>();

const mapStore = useMapStore();

const handleSelect = () => {
    const lat = Number(props.item.latitude);
    const lng = Number(props.item.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
        mapStore.setPinCoordinate(lng, lat);
        mapStore.toggleSearchedMarker(lng, lat);
    }
};
</script>
