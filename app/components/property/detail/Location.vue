<template>
        <div id="location-map-section" class="font-financier text-2xl mb-4 text-cbre-green">
                Location Description
        </div>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1">
                <li v-if="location?.addressFull" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Address :
                        </div>
                        <div class="flex-1">
                                {{ location.addressFull }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1">
                <li v-if="location?.addressFullJibun && location?.addressFullJibun?.trim().length > 0"
                        class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Jibun :
                        </div>
                        <div class="flex-1">
                                {{ location.addressFullJibun }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1">
                <li v-if="location?.addressProvince && location?.addressProvince?.trim().length > 0"
                        class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Province :
                        </div>
                        <div class="flex-1">
                                {{ location.addressProvince }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1">
                <li v-if="location?.addressCity && location?.addressCity?.trim().length > 0" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                City :
                        </div>
                        <div class="flex-1">
                                {{ location.addressCity }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1">
                <li v-if="location?.latitude" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Latitude :
                        </div>
                        <div class="flex-1">
                                {{ location.latitude }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1">
                <li v-if="location?.longitude" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Longitude :
                        </div>
                        <div class="flex-1">
                                {{ location.longitude }}
                        </div>
                </li>
        </ul>

        <div v-if="location?.latitude && location?.longitude" class="detail-map my-10">
                <div ref="mapContainer" style="width: 100%; height: 500px"></div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import useGoogleMapsApi from '~/composables/useGoogleMapsApi';
import type { LocationType } from '~/types/property.type';

declare const google: any;

const props = defineProps<{
        location: LocationType | null | undefined
}>();

const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: any | null = null;
let markerInstance: any | null = null;

const initMap = async () => {
        if (!mapContainer.value || !props.location?.latitude || !props.location?.longitude) return;

        try {
                const googleMaps = await useGoogleMapsApi();
                const position = { lat: props.location.latitude, lng: props.location.longitude };

                const mapOptions: any = {
                        center: position,
                        zoom: 15,
                        mapId: 'DEMO_MAP_ID',
                };

                mapInstance = new googleMaps.Map(mapContainer.value, mapOptions);

                if (googleMaps.marker && googleMaps.marker.AdvancedMarkerElement) {
                        markerInstance = new googleMaps.marker.AdvancedMarkerElement({
                                map: mapInstance,
                                position: position,
                                title: 'Property Location',
                        });
                } else {
                        markerInstance = new googleMaps.Marker({
                                map: mapInstance,
                                position: position,
                        });
                }

        } catch (error) {
                console.error('Failed to load Google Maps:', error);
        }
};

onMounted(() => {
        initMap();
});

watch(() => props.location, () => {
        initMap();
}, { deep: true });

</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>
