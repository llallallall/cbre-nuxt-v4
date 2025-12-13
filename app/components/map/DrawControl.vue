<template>
        <div v-if="calculatedArea > 0 || calculatedLength > 0"
                class="absolute top-5 right-40 bg-white p-4 rounded shadow-lg z-30 font-sans text-2xl text-gray-800 border border-gray-200">
                <p v-if="calculatedArea > 0" class="m-0 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                        <strong>{{ numberFormat(calculatedArea) }}</strong> m² (Polygon)
                </p>
                <p v-if="calculatedLength > 0" class="m-0 flex items-center gap-2 mt-1">
                        <span class="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                        <strong>{{ numberFormat(calculatedLength) }}</strong> km (Line)
                </p>
        </div>
</template>

<script setup lang="ts">
import { onUnmounted, shallowRef, ref, watch } from 'vue';
import { useMapbox } from '#imports';
import { storeToRefs } from 'pinia';
import { useMapStore } from '~/stores/map';
import { useFormat } from '~/composables/useFormat';

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import area from '@turf/area';
import length from '@turf/length';

const { numberFormat } = useFormat();
const draw = shallowRef<any>(null);
const mapRef = shallowRef<any>(null);
const calculatedArea = ref(0);
const calculatedLength = ref(0);
const mapStore = useMapStore();
const { searchedMarkersChanged } = storeToRefs(mapStore);

// Measurement Logic
const updateArea = (e: any) => {
        if (!draw.value) return;
        const data = draw.value.getAll();

        if (data.features.length > 0) {
                let polygonArea = 0;
                let lineLength = 0;

                data.features.forEach((feature: any) => {
                        if (feature.geometry.type === 'Polygon') {
                                polygonArea += area(feature);
                        } else if (feature.geometry.type === 'LineString') {
                                lineLength += length(feature, { units: 'kilometers' });
                        }
                });

                // Format: Area in m^2, Length in km
                calculatedArea.value = Math.round(polygonArea * 100) / 100;
                calculatedLength.value = Math.round(lineLength * 1000 * 100) / 100;
        } else {
                calculatedArea.value = 0;
                calculatedLength.value = 0;
        }
};

const onDrawDelete = (e: any) => {
        updateArea(e);
};


const props = withDefaults(defineProps<{
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>(), {
        position: 'top-right'
});

// Initialize MapboxDraw
useMapbox('cbre-map', (map) => {
        mapRef.value = map;

        draw.value = new MapboxDraw({
                keybindings: true,
                touchEnabled: true,
                displayControlsDefault: false,
                userProperties: true,
                controls: {
                        point: true,
                        line_string: true,
                        polygon: true,
                        trash: true,
                        combine_features: false,
                        uncombine_features: false,
                },
                styles: [
                        // ACTIVE (being drawn)
                        // line stroke
                        {
                                "id": "gl-draw-line",
                                "type": "line",
                                "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                                "layout": {
                                        "line-cap": "round",
                                        "line-join": "round"
                                },
                                "paint": {
                                        "line-color": "#D20C0C",
                                        "line-dasharray": [0.2, 2],
                                        "line-width": 2
                                }
                        },
                        // polygon fill
                        {
                                "id": "gl-draw-polygon-fill",
                                "type": "fill",
                                "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                                "paint": {
                                        "fill-color": "#D20C0C",
                                        "fill-outline-color": "#D20C0C",
                                        "fill-opacity": 0.1
                                }
                        },
                        // polygon mid points
                        {
                                'id': 'gl-draw-polygon-midpoint',
                                'type': 'circle',
                                'filter': ['all',
                                        ['==', '$type', 'Point'],
                                        ['==', 'meta', 'midpoint']],
                                'paint': {
                                        'circle-radius': 3,
                                        'circle-color': '#fbb03b'
                                }
                        },
                        // polygon outline stroke
                        {
                                "id": "gl-draw-polygon-stroke-active",
                                "type": "line",
                                "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                                "layout": {
                                        "line-cap": "round",
                                        "line-join": "round"
                                },
                                "paint": {
                                        "line-color": "#D20C0C",
                                        "line-dasharray": [0.2, 2],
                                        "line-width": 2
                                }
                        },
                        // vertex point halos
                        {
                                "id": "gl-draw-polygon-and-line-vertex-halo-active",
                                "type": "circle",
                                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                                "paint": {
                                        "circle-radius": 5,
                                        "circle-color": "#FFF"
                                }
                        },
                        // vertex points
                        {
                                "id": "gl-draw-polygon-and-line-vertex-active",
                                "type": "circle",
                                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                                "paint": {
                                        "circle-radius": 3,
                                        "circle-color": "#D20C0C",
                                }
                        },
                        // INACTIVE (static, already drawn)
                        // line stroke
                        {
                                "id": "gl-draw-line-static",
                                "type": "line",
                                "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
                                "layout": {
                                        "line-cap": "round",
                                        "line-join": "round"
                                },
                                "paint": {
                                        "line-color": "#000",
                                        "line-width": 3
                                }
                        },
                        // polygon fill
                        {
                                "id": "gl-draw-polygon-fill-static",
                                "type": "fill",
                                "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                                "paint": {
                                        "fill-color": "#000",
                                        "fill-outline-color": "#000",
                                        "fill-opacity": 0.1
                                }
                        },
                        // polygon outline
                        {
                                "id": "gl-draw-polygon-stroke-static",
                                "type": "line",
                                "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                                "layout": {
                                        "line-cap": "round",
                                        "line-join": "round"
                                },
                                "paint": {
                                        "line-color": "#000",
                                        "line-width": 3
                                }
                        },
                        // Custom styles for search markers or other features can be added here
                        {
                                'id': 'highlight-active-points',
                                'type': 'symbol',
                                'filter': ['all',
                                        ['==', '$type', 'Point'],
                                        ['==', 'meta', 'feature'],
                                        ['==', 'active', 'true']],
                                'layout': {
                                        "icon-image": "redPin",
                                        "icon-size": 0.9,
                                        "icon-anchor": 'bottom',
                                        "icon-offset": [0, 14],
                                        "icon-ignore-placement": true,
                                        "icon-allow-overlap": true
                                },
                                "paint": {
                                        "icon-color": "#ff0000",
                                        "icon-halo-color": "#fff",
                                        "icon-halo-width": 2
                                }
                        },
                        {
                                'id': 'points-are-blue',
                                'type': 'symbol',
                                'filter': ['all',
                                        ['==', '$type', 'Point'],
                                        ['==', 'meta', 'feature'],
                                        ['==', 'active', 'false']],
                                'layout': {
                                        "icon-image": "redPin",
                                        "icon-size": 0.7,
                                        "icon-anchor": 'bottom',
                                        "icon-offset": [0, 10],
                                        "icon-ignore-placement": true,
                                        "icon-allow-overlap": true
                                },
                                "paint": {
                                        "icon-color": "#ff0000",
                                        "icon-halo-color": "#fff",
                                        "icon-halo-width": 2
                                }
                        }

                ]
        });

        // Add control to specified position
        if (!map.hasControl(draw.value)) {
                map.addControl(draw.value, props.position);
        }

        // Event Listeners
        map.on('draw.create', updateArea);
        map.on('draw.delete', onDrawDelete);
        map.on('draw.update', updateArea);

        // Initial sync if markers exist
        syncMarkers();
});

const syncMarkers = () => {
        if (!draw.value) return;

        // Logic to sync markers from store to draw features if needed
        // Copied from depreciated logic:
        if (mapStore.searchedMarkers && mapStore.searchedMarkers.length > 0) {
                mapStore.searchedMarkers.forEach(marker => {
                        // Implementation depends on how we want to represent markers in draw
                        // Often it's better to use a separate layer for search markers,
                        // but if the requirement is to make them editable via draw:
                        /*
                        const feature = {
                           id: `search-marker-${Date.now()}`,
                           type: 'Feature',
                           geometry: { type: 'Point', coordinates: [marker.longitude, marker.latitude] },
                           properties: {}
                        };
                        draw.value.add(feature);
                        */
                });
        }
}

// Watch store for changes
watch(searchedMarkersChanged, () => {
        syncMarkers();
});

onUnmounted(() => {
        if (mapRef.value && draw.value) {
                // Remove event listeners
                mapRef.value.off('draw.create', updateArea);
                mapRef.value.off('draw.delete', onDrawDelete);
                mapRef.value.off('draw.update', updateArea);

                // Remove control
                if (mapRef.value.hasControl(draw.value)) {
                        mapRef.value.removeControl(draw.value);
                }
        }
});
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
