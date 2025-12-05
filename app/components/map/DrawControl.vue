<template>
    <div v-if="calculatedArea > 0 || calculatedLength > 0" class="absolute top-10 right-20 bg-white p-4 rounded shadow-lg z-50 font-sans text-sm text-gray-800">
        <p v-if="calculatedArea > 0" class="m-0"><strong>{{ calculatedArea }}</strong> m² (Polygon)</p>
        <p v-if="calculatedLength > 0" class="m-0"><strong>{{ calculatedLength }}</strong> m (Line)</p>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, shallowRef, ref } from 'vue';

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import area from '@turf/area';
import length from '@turf/length';

const draw = shallowRef<any>(null);
const mapRef = shallowRef<any>(null);
const calculatedArea = ref(0);
const calculatedLength = ref(0);

const updateArea = (e: any) => {
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

        calculatedArea.value = Math.round(polygonArea * 100) / 100;
        calculatedLength.value = Math.round(lineLength * 1000 * 100) / 100;
    } else {
        calculatedArea.value = 0;
        calculatedLength.value = 0;
    }
};

useMapbox('cbre-map', (map) => {
    mapRef.value = map;
    draw.value = new MapboxDraw({
        keybindings: false,
        touchEnabled: false,
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
    map.addControl(draw.value, "top-right");

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);
});

onUnmounted(() => {
    if (mapRef.value) {
        if (draw.value) {
            mapRef.value.removeControl(draw.value);
        }
        mapRef.value.off('draw.create', updateArea);
        mapRef.value.off('draw.delete', updateArea);
        mapRef.value.off('draw.update', updateArea);
    }
});
</script>
