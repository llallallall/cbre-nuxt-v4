<template>
        <div class="cbre-panel-card cursor-pointer group hover:border-cbre-green transition-colors !p-3 !py-2"
                @click="handleSelect">

                <div class="flex justify-between items-start">
                        <!-- Content -->
                        <div class="flex-1 min-w-0 mr-2">
                                <div class="flex items-center gap-2 mb-0.5">
                                        <div
                                                class="text-[1.5rem] font-bold truncate group-hover:text-[var(--color-primary-1)] leading-tight">
                                                {{ item?.name || item?.formatted_address }}
                                        </div>
                                        <div v-if="item?.category"
                                                class="text-[1.2rem] text-[var(--color-primary-1)] font-medium truncate shrink-0">
                                                {{ formatCategory(item.category) }}
                                        </div>
                                </div>

                                <div class="cbre-text-meta flex flex-col gap-0.5">
                                        <div class="flex items-center text-[1.3rem]">
                                                <span class="truncate">{{ item?.address || item?.formatted_address
                                                }}</span>
                                        </div>

                                        <div class="flex items-center text-[1.1rem] opacity-60">
                                                <Icon name="ph:map-pin" size="12" class="mr-1" />
                                                <span>{{ item?.latitude }}, {{ item?.longitude }}</span>
                                        </div>
                                </div>
                        </div>

                        <!-- Badge -->
                        <div class="cbre-badge-circle cbre-badge-circle-blue shrink-0 scale-90 mt-1">
                                G
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
                mapStore.toggleSearchedMarker(lng, lat, 'GOOGLE');
        }
};

// Google Place Type 포맷팅 (예: "administrative_area_level_1" -> "Administrative Area")
const formatCategory = (cat: string) => {
        if (!cat) return '';
        return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>
