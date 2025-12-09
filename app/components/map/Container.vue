<template>
        <div ref="printArea" class="relative flex w-full h-full">

                <MapboxMap map-id="cbre-map" style="position: relative; width: 100%; height : calc(100vh - 80px);"
                        :options="{
                                accessToken: mapboxAccessToken,
                                style: 'mapbox://styles/mapbox/' + mapStyleId,
                                center: mapCenter,
                                zoom: mapZoom,
                                maxZoom: maxZoom,
                                minZoom: minZoom,
                                pitch: mapStore.mapPitch,
                                bearing: mapStore.mapBearing,
                                antialias: true,
                                attributionControl: false,
                                preserveDrawingBuffer: true,
                                hash: false,
                        }" @load="onMapLoad">

                        <MapboxLayer v-if="propertyStore.initialDataLoaded && imagesLoaded" :layer="{
                                source: 'composite',
                                id: LAYER_3D_BUILDINGS.id,
                                type: LAYER_3D_BUILDINGS.type as any,
                                filter: LAYER_3D_BUILDINGS.filter,
                                'source-layer': LAYER_3D_BUILDINGS.sourceLayer,
                                minzoom: LAYER_3D_BUILDINGS.minzoom,
                                paint: LAYER_3D_BUILDINGS.paint as any
                        }" />

                        <MapboxLayer v-if="propertyStore.initialDataLoaded && imagesLoaded"
                                :beforeLayer="LAYER_3D_BUILDINGS.id" :layer="{
                                        source: 'cbre-assets',
                                        id: LAYER_UNCLUSTERED_POINT.id,
                                        type: LAYER_UNCLUSTERED_POINT.type as any,
                                        filter: LAYER_UNCLUSTERED_POINT.filter,
                                        layout: LAYER_UNCLUSTERED_POINT.layout as any,
                                        paint: LAYER_UNCLUSTERED_POINT.paint
                                }" />

                        <MapboxLayer v-if="propertyStore.initialDataLoaded && imagesLoaded"
                                :beforeLayer="LAYER_UNCLUSTERED_POINT.id" :layer="{
                                        source: 'cbre-assets',
                                        id: LAYER_CLUSTER_COUNT.id,
                                        type: LAYER_CLUSTER_COUNT.type as any,
                                        filter: LAYER_CLUSTER_COUNT.filter,
                                        layout: LAYER_CLUSTER_COUNT.layout as any,
                                        paint: LAYER_CLUSTER_COUNT.paint as any
                                }" />

                        <MapboxLayer v-if="propertyStore.initialDataLoaded && imagesLoaded"
                                :beforeLayer="LAYER_CLUSTER_COUNT.id" :layer="{
                                        source: 'cbre-assets',
                                        id: LAYER_CLUSTERS.id,
                                        type: LAYER_CLUSTERS.type as any,
                                        filter: LAYER_CLUSTERS.filter,
                                        paint: LAYER_CLUSTERS.paint as any
                                }" />

                        <MapboxSource source-id="cbre-assets" :source="(cbreDataSource as any)" />


                        <MapboxNavigationControl position="top-left" :options="{ showCompass: true, showZoom: true }" />
                        <MapboxFullscreenControl v-if="fullscreenSupported" position="top-right" />

                        <StyleControl v-if="propertyStore.initialDataLoaded" />
                        <SelectionControl v-if="propertyStore.initialDataLoaded" />
                        <DrawControl v-if="propertyStore.initialDataLoaded" />
                        <ExportControl v-if="propertyStore.initialDataLoaded" />

                        <MapboxGeolocateControl position="top-left" />

                </MapboxMap>

                <MapboxMap map-id="cbre-minimap" :class="uiStore.showMiniMap ? 'hidden lg:block' : 'hidden'"
                        style="position: absolute; top:calc(100% - 260px); left:0; width: 220px; height:260px; z-index:10;"
                        :options="{
                                accessToken: mapboxAccessToken,
                                style: 'mapbox://styles/mapbox/' + mapStyleId,
                                center: [128, 36],
                                zoom: 5,
                                maxZoom: 5,
                                minZoom: 5,
                                antialias: true,
                                attributionControl: false,
                                hash: false
                        }">
                        <MapboxLayer :layer="(LAYER_MINIMAP_POINTS as any)" />

                        <MapboxLayer :layer="(LAYER_MINIMAP_HEAT as any)" />
                        <MapboxSource source-id="cbre-minimap-points" :source="(cbreDataSource as any)" />
                </MapboxMap>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef } from 'vue';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';
import { mapCenter, mapZoom, maxZoom, minZoom, LAYER_3D_BUILDINGS, LAYER_CLUSTERS, LAYER_CLUSTER_COUNT, LAYER_UNCLUSTERED_POINT, LAYER_MINIMAP_POINTS, LAYER_MINIMAP_HEAT } from '~/context/mapData';
import StyleControl from './StyleControl.vue';
import SelectionControl from './SelectionControl.vue';
import DrawControl from './DrawControl.vue';
import ExportControl from './ExportControl.vue';

import { useAppToast } from '~/composables/useAppToast';

const mapStore = useMapStore();
const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const { getThumbnailUrl } = useFormat();
const { showToast } = useAppToast();

const { filterMapPins, flyTo, searchedMarkersChanged } = storeToRefs(mapStore);
const { filteredProperties } = storeToRefs(propertyStore);

const mapRef = useMapboxRef("cbre-map");
const miniMapRef = useMapboxRef("cbre-minimap");
const printArea = ref(null);
const imagesLoaded = ref(false);
const fullscreenSupported = ref(false);

const mapStyleId = computed(() => mapStore.mapStyleId);

onMounted(async () => {
        if (typeof document !== 'undefined') {
                fullscreenSupported.value = document.fullscreenEnabled;
        }

        if (import.meta.client) {
                const mapboxgl = (await import("mapbox-gl")).default;
                const config = useRuntimeConfig();
                const mapboxAccessToken = config.public.mapbox?.accessToken || '';
                if (mapboxAccessToken) {
                        mapboxgl.accessToken = mapboxAccessToken;
                }
        }
});

const config = useRuntimeConfig();
const mapboxAccessToken = config.public.mapbox?.accessToken || '';

const cbreDataSource = computed(() => {
        let assets = propertyStore.getFilteredMapData;

        if (mapStore.filterMapPins) {
                assets = assets.filter(asset => propertyStore.keptPropertyIds.includes(asset.id));
        }

        const features = assets.map(asset => ({
                type: 'Feature',
                geometry: {
                        type: 'Point',
                        coordinates: [asset.longitude, asset.latitude]
                },
                properties: {
                        propertyId: asset.id,
                        propertyName: asset.name,
                        mainImageUrl: getThumbnailUrl(asset.mainImageUrl),
                        sector: asset.sector || '',
                        subSector: asset.subSector || '',
                        mag: 1,
                }
        }));

        return {
                type: 'geojson',
                data: {
                        type: 'FeatureCollection',
                        features: features
                },
                cluster: true,
                clusterMaxZoom: 12,
                clusterRadius: 50,
        };
});

const onMapLoad = () => {
        propertyStore.initialDataLoaded = true;
};



watch(() => propertyStore.filteredProperties, () => {
        const sourceData = cbreDataSource.value.data;
        // @ts-ignore
        mapRef.value?.getSource('cbre-assets')?.setData(sourceData);
        // @ts-ignore
        miniMapRef.value?.getSource('cbre-minimap-points')?.setData(sourceData);
}, { deep: true });

watch(flyTo, (nv) => {
        if (nv === true) {
                mapRef.value?.flyTo({
                        center: [Number(mapStore.pinCoordinate.longitude), Number(mapStore.pinCoordinate.latitude)],
                        zoom: mapStore.pinCoordinate.zoom,
                        speed: mapStore.pinCoordinate.speed,
                        curve: mapStore.pinCoordinate.curve
                });
                mapStore.flyTo = false;
        }
});



// Image loading logic extracted to handle style changes
const loadMapImages = (map: any) => {
        const p1 = new Promise<void>((resolve) => {
                if (map.hasImage('pin')) {
                        resolve();
                        return;
                }
                map.loadImage('/images/pin.png', (error: any, image: any) => {
                        if (error) {
                                console.error('Failed to load pin.png', error);
                                resolve();
                                return;
                        }
                        if (!map.hasImage('pin') && image) map.addImage('pin', image);
                        resolve();
                });
        });

        const p2 = new Promise<void>((resolve) => {
                if (map.hasImage('redPin')) {
                        resolve();
                        return;
                }
                map.loadImage('/images/red-pin.png', (error: any, image: any) => {
                        if (error) {
                                console.error('Failed to load red-pin.png', error);
                                resolve();
                                return;
                        }
                        if (!map.hasImage('redPin') && image) map.addImage('redPin', image);
                        resolve();
                });
        });

        Promise.all([p1, p2]).then(() => {
                imagesLoaded.value = true;
        });
};

useMapboxBeforeLoad("cbre-map", async (map) => {
        if (import.meta.client) {
                const MapboxLanguage = (await import("@mapbox/mapbox-gl-language")).default;
                mapStore.mapLanguagePlugin = new MapboxLanguage({ defaultLanguage: mapStore.selectedMapLanguage?.value || "en" });
        }
        loadMapImages(map);
});

useMapbox("cbre-map", async (map) => {
        if (mapStore.mapLanguagePlugin) {
                map.addControl(mapStore.mapLanguagePlugin);
        }

        // Re-add images when style changes (e.g. invalidating sprites)
        map.on('styledata', () => {
                loadMapImages(map);
        });

        map.on('click', 'clusters', (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                if (!features.length) return;
                const properties = features[0]?.properties;
                if (!properties) return;
                const clusterId = properties.cluster_id;

                // @ts-ignore
                map.getSource('cbre-assets').getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                                // @ts-ignore
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                        });
                });
        });

        map.on('click', 'unclustered-point', async (e) => {
                const feature = e.features?.[0];
                if (!feature) return;

                // @ts-ignore
                const coordinates = feature.geometry.coordinates.slice();
                const props = feature.properties;

                if (!props) return;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                const mapboxgl = (await import("mapbox-gl")).default;
                new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`
                <div class="w-full h-full p-2">
                    <a href="/property/${props.propertyId}" target="_blank" rel="noopener noreferrer">
                        <div class="flex flex-col gap-1">
                            <div class="font-bold text-md mb-1">${props.propertyName}</div>
                            <div class="text-xs text-gray-600">
                                <div>Sector: ${props.sector}</div>
                                <div>SubSector: ${props.subSector}</div>
                            </div>
                             <div class="w-full h-[100px] mt-2 rounded overflow-hidden">
                                <img src="${props.mainImageUrl}" class="w-full h-full object-cover" alt="Property Image" />
                            </div>
                        </div>
                    </a>
                </div>
            `)
                        .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
        map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });
});
</script>
