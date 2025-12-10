<template>
        <div class="relative w-full h-full">
                <!-- Controls Overlay (Top Right / Top Left) -->
                <!-- Note: Mapbox Controls (Nav, Geolocate) are managed by MapboxMap slots/props or default -->

                <MapSelectionControl position="top-left" class="!top-[1rem] !left-[1rem]" />

                <MapStyleControl position="top-left" class="!top-[5rem] !left-[1rem]" />



                <MapboxMap map-id="cbre-map" class="w-full h-full" :options="mapOptions" @load="onMapLoad">
                        <!-- 3D Buildings Layer -->
                        <MapboxLayer v-if="styleLoaded && !isStandardStyle" :layer="{
                                id: LAYER_3D_BUILDINGS.id,
                                source: 'composite',
                                'source-layer': LAYER_3D_BUILDINGS.sourceLayer,
                                type: LAYER_3D_BUILDINGS.type,
                                minzoom: LAYER_3D_BUILDINGS.minzoom,
                                filter: LAYER_3D_BUILDINGS.filter,
                                paint: LAYER_3D_BUILDINGS.paint
                        }" />

                        <!-- Property Data Layers -->
                        <template v-if="imagesLoaded && styleLoaded">
                                <MapboxSource source-id="cbre-assets" :source-options="cbreDataSource" />

                                <!-- Unclustered Points (Individual Pins) -->
                                <MapboxLayer :layer="{
                                        id: LAYER_UNCLUSTERED_POINT.id,
                                        type: LAYER_UNCLUSTERED_POINT.type,
                                        source: 'cbre-assets',
                                        filter: LAYER_UNCLUSTERED_POINT.filter,
                                        layout: LAYER_UNCLUSTERED_POINT.layout,
                                        paint: LAYER_UNCLUSTERED_POINT.paint
                                }" />

                                <!-- Cluster Count Text -->
                                <MapboxLayer :layer="{
                                        id: LAYER_CLUSTER_COUNT.id,
                                        type: LAYER_CLUSTER_COUNT.type,
                                        source: 'cbre-assets',
                                        filter: LAYER_CLUSTER_COUNT.filter,
                                        layout: LAYER_CLUSTER_COUNT.layout,
                                        paint: LAYER_CLUSTER_COUNT.paint
                                }" />

                                <!-- Clusters (Circles) -->
                                <MapboxLayer :layer="{
                                        id: LAYER_CLUSTERS.id,
                                        type: LAYER_CLUSTERS.type,
                                        source: 'cbre-assets',
                                        filter: LAYER_CLUSTERS.filter,
                                        paint: LAYER_CLUSTERS.paint
                                }" :beforeId="LAYER_CLUSTER_COUNT.id" />
                        </template>

                        <!-- Standard Controls -->
                        <MapboxNavigationControl position="top-right" />
                        <MapboxGeolocateControl position="top-right" />
                        <MapboxFullscreenControl position="top-right" />
                        <MapExportControl position="top-right" />
                        <MapDrawControl position="top-right" />

                </MapboxMap>
        </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import {
        mapCenter, mapZoom, mapPitch, mapBearing, MAPBOX_LOCALE_KO, MapLangOptions,
        LAYER_3D_BUILDINGS, LAYER_CLUSTERS, LAYER_CLUSTER_COUNT, LAYER_UNCLUSTERED_POINT
} from '~/context/mapData';

const { locale } = useI18n();
const mapStore = useMapStore();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { getThumbnailUrl } = useFormat();
const mapRef = ref<any>(null);
const config = useRuntimeConfig();
const mapboxAccessToken = config.public.mapbox?.accessToken || '';

// State
const imagesLoaded = ref(false);
const styleLoaded = ref(false);

const isStandardStyle = computed(() => {
        return mapStore.selectedMapStyle?.id?.includes('standard') || false;
});

// DataSource for Properties
const cbreDataSource = computed(() => {
        let assets = propertyStore.getFilteredMapData || [];

        if (mapStore.filterMapPins) {
                assets = assets.filter(asset => propertyStore.keptPropertyIds.includes(asset.id));
        }

        const features = assets.map(asset => ({
                type: 'Feature',
                geometry: {
                        type: 'Point',
                        coordinates: [Number(asset.longitude), Number(asset.latitude)]
                },
                properties: {
                        propertyId: asset.id,
                        propertyName: asset.name,
                        mainImageUrl: getThumbnailUrl(asset.mainImageUrl),
                        sector: asset.sector || '',
                        subSector: asset.subSector || '',
                        mag: 1, // Magnitude for heatmap/clusters if needed
                }
        }));

        return {
                type: 'geojson',
                data: {
                        type: 'FeatureCollection',
                        features: features
                },
                cluster: true,
                clusterMaxZoom: 14, // Adjusted from 12?
                clusterRadius: 50,
        };
});

onMounted(() => {
        // Client-side access token handling if needed
});

const loadMapImages = (map: any) => {
        const images = [
                { name: 'pin', url: '/images/pin.png' },
                { name: 'redPin', url: '/images/red-pin.png' } // If used
        ];

        const promises = images.map(img => {
                return new Promise<void>((resolve) => {
                        if (map.hasImage(img.name)) return resolve();
                        map.loadImage(img.url, (error: any, image: any) => {
                                if (error) {
                                        console.warn(`Failed to load ${img.name}:`, error);
                                        return resolve();
                                }
                                if (!map.hasImage(img.name)) map.addImage(img.name, image);
                                resolve();
                        });
                });
        });

        Promise.all(promises).then(() => {
                imagesLoaded.value = true;
                console.log('[Container] Map images loaded.');
        });
};

const onMapLoad = (v: any) => {
        // v can be map instance or event depending on Nuxt version/library
        // But we capture map via useMapbox mostly. 
        // Just in case template event fires:
        console.log('[Container] Map @load event.');
};

// Use robust composable to capture map instance
useMapbox('cbre-map', (map) => {
        mapRef.value = map;

        // Initial Sync
        loadMapImages(map);
        const currentLang = locale.value;
        console.log('[Container] Map initialized. Initial Language:', currentLang);

        const onStyleLoad = () => {
                styleLoaded.value = true;
                console.log('[Container] Style loaded. Syncing language & images.');

                // Language Sync
                updateLanguage(locale.value, map);

                // Re-load images if style wipe removed them
                loadMapImages(map);

                // Disable global loader if active
                if (statusStore.isLoading) {
                        statusStore.setGlobalLoading(false);
                }
        };

        if (map.isStyleLoaded()) {
                onStyleLoad();
        } else {
                map.once('style.load', onStyleLoad);
        }

        // Persistent listener for future style changes
        map.on('style.load', onStyleLoad);

        // Backup check after 1 second to catch any race conditions
        setTimeout(() => {
                if (map.isStyleLoaded()) {
                        console.log('[Container] 1s Backup check triggering language update.');
                        updateLanguage(locale.value, map);
                }
        }, 1000);

        // --- Interactions --- //

        // Clusters Click -> Zoom
        map.on('click', LAYER_CLUSTERS.id, (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTERS.id] });
                if (!features.length) return;
                const clusterId = features[0]?.properties?.cluster_id;

                const source = map.getSource('cbre-assets');
                if (source && (source as any).getClusterExpansionZoom) {
                        (source as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                                if (err) return;
                                map.easeTo({
                                        center: (features[0]?.geometry as any)?.coordinates,
                                        zoom: zoom
                                });
                        });
                }
        });

        // Unclustered Point Click -> Popup
        map.on('click', LAYER_UNCLUSTERED_POINT.id, async (e) => {
                if (!e.features?.length) return;
                const feature = e.features[0];
                const props = feature?.properties;
                const coordinates = (feature?.geometry as any)?.coordinates.slice();

                // Ensure we show popup over the copy being pointed to
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                const mapboxgl = await import('mapbox-gl').then(m => m.default || m);
                new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`
                <div class="w-full h-full p-2 min-w-[200px]">
                    <a href="/property/${props?.propertyId}" target="_blank" rel="noopener noreferrer">
                        <div class="flex flex-col gap-1">
                            <div class="font-bold text-md mb-1">${props?.propertyName}</div>
                            <div class="text-xs text-gray-600">
                                <div>Sector: ${props?.sector}</div>
                                <div>SubSector: ${props?.subSector}</div>
                            </div>
                             <div class="w-full h-[100px] mt-2 rounded overflow-hidden">
                                <img src="${props?.mainImageUrl}" class="w-full h-full object-cover" alt="Property Image" />
                            </div>
                        </div>
                    </a>
                </div>
            `)
                        .addTo(map);
        });

        // Cursor
        const setPointer = () => map.getCanvas().style.cursor = 'pointer';
        const resetPointer = () => map.getCanvas().style.cursor = '';

        map.on('mouseenter', LAYER_CLUSTERS.id, setPointer);
        map.on('mouseleave', LAYER_CLUSTERS.id, resetPointer);
        map.on('mouseenter', LAYER_UNCLUSTERED_POINT.id, setPointer);
        map.on('mouseleave', LAYER_UNCLUSTERED_POINT.id, resetPointer);

        // Notify store that map is ready (important for data fetching/filtering flow)
        propertyStore.initialDataLoaded = true;
});

// Watch for property data changes -> Update Map Source
watch(() => propertyStore.filteredProperties, () => {
        if (!mapRef.value) return;
        const source = mapRef.value.getSource('cbre-assets');
        if (source) {
                // @ts-ignore
                source.setData(cbreDataSource.value.data);
                console.log('[Container] Updated cbre-assets source data.');
        }
}, { deep: true });

// Watch for map language changes (Store)
watch(() => mapStore.selectedMapLanguage, (newLangObj) => {
        if (newLangObj?.value) {
                console.log('[Container] Map language changed to:', newLangObj.value);
                updateLanguage(newLangObj.value);
        }
});

// Watch for global locale changes (Sync Store)
watch(locale, (newLang) => {
        console.log('[Container] Global locale changed to:', newLang);

        // Sync store with global locale
        const found = MapLangOptions.find(opt => opt.value === newLang);
        if (found) {
                mapStore.selectedMapLanguage = found;
        }

        updateLanguage(newLang);
});

// Watch for flyTo actions (e.g. from Sidebar)
watch(() => mapStore.flyTo, (nv) => {
        if (nv === true && mapRef.value) {
                mapRef.value.flyTo({
                        center: [Number(mapStore.pinCoordinate.longitude), Number(mapStore.pinCoordinate.latitude)],
                        zoom: mapStore.pinCoordinate.zoom,
                        speed: mapStore.pinCoordinate.speed,
                        curve: mapStore.pinCoordinate.curve
                });
                mapStore.flyTo = false;
        }
});

// Watch for map style changes
watch(() => mapStore.selectedMapStyle, (newStyle) => {
        if (!mapRef.value || !newStyle?.value) return;

        console.log('[Container] Style changed to:', newStyle.label);
        mapRef.value.setStyle(newStyle.value);

        // Style load listener handles the rest
});

const updateLanguage = (lang: string, mapInstance?: any) => {
        const map = mapInstance || mapRef.value;
        if (!map) return;

        if (!map.isStyleLoaded()) {
                // Redundant safely covered by on('style.load') but good for backup
                return;
        }

        const style = map.getStyle();
        if (!style || !style.layers) return;

        const fieldName = `name_${lang}`;
        let updatedCount = 0;

        for (const layer of style.layers) {
                if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
                        if (layer.source === 'composite') {
                                if (layer.id.includes('label') || layer.id.includes('place') || layer.id.includes('poi')) {
                                        map.setLayoutProperty(layer.id, 'text-field', ['get', fieldName]);
                                        updatedCount++;
                                }
                        }
                }
        }
        console.log(`[Container] Language updated to ${fieldName}. Affected layers: ${updatedCount}`);
};

const mapOptions = computed(() => ({
        accessToken: mapboxAccessToken,
        style: 'mapbox://styles/mapbox/light-v11',
        center: mapCenter,
        zoom: mapZoom,
        pitch: mapPitch,
        bearing: mapBearing,
        preserveDrawingBuffer: true, // Required for map export
        // UI Localization
        locale: locale.value === 'ko' ? MAPBOX_LOCALE_KO : undefined
}));
</script>


<style>
/* Global overrides for Mapbox controls to match custom design */
.mapboxgl-ctrl-group {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        background-color: white !important;
        border-radius: 0px !important;
        border-width: 0px !important;
        margin-bottom: 4px !important;
}

/* Base button styling */
.mapboxgl-ctrl-group button,
.mapbox-gl-draw_ctrl-draw-btn,
.mapboxgl-ctrl-icon {
        width: 3.5rem !important;
        height: 3.5rem !important;
        padding: 0px !important;
        border: none !important;
        background-color: white !important;
        border-radius: 0px !important;
        box-sizing: border-box !important;
        transition: all 200ms ease !important;

        /* Center content */
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
}


/* 
   ICON STYLING 
   - Print icon was too big -> fixed with explicit background-size
   - Draw icons weren't styled -> targeted class directly
*/
.mapboxgl-ctrl-icon,
.mapbox-gl-draw_ctrl-draw-btn {
        /* Force icon size inside the button */
        background-size: 24px 24px !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-color: var(--text-accent) !important;

        /* Default State: Greyish (Opacity) */
        opacity: 0.3 !important;
        filter: grayscale(100%) !important;
        /* Ensure neutral look */
}

/* Export Control Specific Size Tweak if needed */
.mapboxgl-export-control {
        background-size: 50% !important;
        /* User preference maintained */
}

/* 
   Export Control Dropdown Styling 
   - Fix button width
   - Add padding
*/
.mapboxgl-export-list {
        padding: 12px !important;
        min-width: 240px !important;
}

.mapboxgl-export-list .generate-button {
        width: 100% !important;
        justify-content: center !important;
        margin-top: 8px !important;
        cursor: pointer !important;
        color: white !important;
        font-weight: 600 !important;
        background-color: #003F2D !important;
}

.mapboxgl-export-list .generate-button:hover {
        color: #003F2D !important;
        background-color: #17E88F !important;
}

/* 
   HOVER EFFECTS
   - Restore opacity
   - Apply Accent Color using Filter (approximating var(--eds-color-accent))
   - Light grey background for the button box
*/
.mapboxgl-ctrl-group button:hover .mapboxgl-ctrl-icon:hover,
.mapbox-gl-draw_ctrl-draw-btn:hover,
.mapboxgl-export-control:hover {
        opacity: 1 !important;
}
</style>
