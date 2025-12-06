<template>
        <div class="cbre-panel-result-item" @click="handleSelect">

                <div class="flex justify-between items-center">
                        <div
                                class="w-[calc(100%-40px)] cbre-text-body-md font-bold truncate group-hover:text-[var(--color-primary-1)]">
                                {{ item?.name || item?.formatted_address }}
                        </div>
                        <div class="cbre-badge-circle cbre-badge-circle-blue">
                                G
                        </div>
                </div>

                <div class="cbre-text-meta flex flex-col gap-1">
                        <div v-if="item?.category"
                                class="flex items-center text-[var(--color-primary-1)] font-medium mb-0.5">
                                {{ formatCategory(item.category) }}
                        </div>

                        <div class="flex items-center">
                                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                                <span class="truncate">{{ item?.address || item?.formatted_address }}</span>
                        </div>

                        <div class="flex items-center mt-1 opacity-70">
                                <Icon name="ph:map-pin" size="12" class="mr-1" />
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
                formatted_address?: string;
                category?: string; // types[0]
                address?: string;
                province?: string;
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

// Google Place Type 포맷팅 (예: "administrative_area_level_1" -> "Administrative Area")
const formatCategory = (cat: string) => {
        if (!cat) return '';
        return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>
