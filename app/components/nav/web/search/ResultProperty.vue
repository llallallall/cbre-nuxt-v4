<template>
        <div class="cbre-panel-card mb-3 cursor-pointer group hover:border-cbre-green transition-colors !p-4"
                @click="handleSelect">
                <div class="flex justify-between items-center mb-2">
                        <div
                                class="w-[calc(100%-40px)] cbre-text-body-md font-bold truncate group-hover:text-[var(--color-primary-1)]">
                                {{ item?.name }}
                        </div>
                        <div class="cbre-badge-circle cbre-badge-circle-green">
                                P
                        </div>
                </div>

                <div class="cbre-text-meta flex flex-col gap-1">
                        <div class="flex items-center">
                                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                                <span class="truncate">{{ item.addressFull || 'No Address' }}</span>
                        </div>

                        <div class="flex items-center mt-1 opacity-70">
                                <Icon name="ph:map-pin" size="12" class="mr-1" />
                                <span>{{ item?.latitude }}, {{ item?.longitude }}</span>
                        </div>
                        <div class="flex items-center mt-1 gap-2">
                                <span v-if="item.sector" class="text-xs bg-gray-100 px-1 rounded text-gray-600">{{
                                        item.sector }}</span>
                                <span v-if="item.grade" class="text-xs bg-gray-100 px-1 rounded text-gray-600">{{
                                        item.grade }}</span>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map';

const props = defineProps<{
        item: {
                id: string;
                name: string;
                addressFull?: string;
                latitude: number | string;
                longitude: number | string;
                sector?: string;
                grade?: string;
        }
}>();

const mapStore = useMapStore();

const handleSelect = () => {
        const lat = Number(props.item.latitude);
        const lng = Number(props.item.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
                // 1. 지도 이동
                mapStore.setPinCoordinate(lng, lat);
                // 2. 검색 마커 추가/제거 (토글)
                mapStore.toggleSearchedMarker(lng, lat);

                // Optional: Select global property if needed
                // mapStore.selectAssetPin(props.item.id); 
        }
};
</script>
