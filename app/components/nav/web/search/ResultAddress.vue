<template>
        <div class="cbre-panel-card cursor-pointer group hover:border-cbre-green transition-colors !p-3 !py-2"
                @click="handleSelect">
                <div class="flex justify-between items-start">
                        <!-- Content -->
                        <div class="flex-1 min-w-0 mr-2">
                                <div class="flex items-center gap-2 mb-0.5">
                                        <div
                                                class="text-[1.5rem] font-bold truncate group-hover:text-[var(--color-primary-1)] leading-tight">
                                                {{ item?.address_name }}
                                        </div>
                                </div>

                                <div class="cbre-text-meta flex flex-col gap-0.5">
                                        <div class="flex items-center text-[1.3rem]">
                                                <span class="truncate">{{ item?.road_address?.address_name ||
                                                        item.address?.address_name }}</span>
                                        </div>

                                        <div class="flex items-center text-[1.1rem] opacity-60">
                                                <Icon name="ph:map-pin" size="12" class="mr-1" />
                                                <span>{{ item?.y }}, {{ item?.x }}</span>
                                        </div>
                                </div>
                        </div>

                        <!-- Badge -->
                        <div class="cbre-badge-circle cbre-badge-circle-yellow shrink-0 scale-90 mt-1">
                                A
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map';

const props = defineProps<{
        item: {
                name?: string;
                address_name?: string;
                province?: string;
                city?: string;
                street?: string;
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
                // 1. 지도 이동
                mapStore.setPinCoordinate(lng, lat);
                // 2. 검색 마커 추가/제거 (토글)
                mapStore.toggleSearchedMarker(lng, lat, 'KAKAO');
        }
};
</script>
