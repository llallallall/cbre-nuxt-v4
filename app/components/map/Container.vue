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
                                <MapboxSource source-id="cbre-assets" :source="(cbreDataSource as any)" />

                                <!-- Unclustered Points (Individual Pins) -->
                                <MapboxLayer :layer="{
                                        id: LAYER_UNCLUSTERED_POINT.id,
                                        type: LAYER_UNCLUSTERED_POINT.type,
                                        source: 'cbre-assets',
                                        filter: LAYER_UNCLUSTERED_POINT.filter,
                                        layout: LAYER_UNCLUSTERED_POINT.layout,
                                        paint: LAYER_UNCLUSTERED_POINT.paint
                                }" />
                        </template>

                        <!-- Searched Markers Layer -->
                        <template v-if="imagesLoaded && styleLoaded">
                                <MapboxSource source-id="searched-markers" :source="(searchedDataSource as any)" />
                                <MapboxLayer :layer="{
                                        id: 'layer-searched-markers',
                                        type: 'symbol',
                                        source: 'searched-markers',
                                        layout: {
                                                'icon-image': [
                                                        'match',
                                                        ['get', 'type'],
                                                        'KAKAO', 'marker_kakao',
                                                        'GOOGLE', 'marker_google',
                                                        'pin' // Default
                                                ],
                                                'icon-size': 0.8,
                                                'icon-allow-overlap': true,
                                                'icon-anchor': 'bottom'
                                        }
                                }" />
                        </template>

                        <!-- Standard Controls -->
                        <MapboxNavigationControl position="top-right" />
                        <MapboxGeolocateControl position="top-right" />
                        <MapboxFullscreenControl position="top-right" />
                        <MapExportControl position="top-right" />
                        <MapDrawControl position="top-right" />

                </MapboxMap>

                <!-- Mini Map -->
                <div v-if="uiStore.showMiniMap"
                        class="absolute bottom-8 right-8 w-[200px] h-[200px] rounded-lg border-2 border-white shadow-xl overflow-hidden z-20 hidden md:block transition-all duration-300">
                        <MapboxMap map-id="cbre-minimap" class="w-full h-full" :options="miniMapOptions">
                                <MapboxLayer :layer="(LAYER_MINIMAP_POINTS as any)" />
                                <MapboxLayer :layer="(LAYER_MINIMAP_HEAT as any)" />
                                <MapboxSource source-id="cbre-minimap-points" :source="(cbreDataSource as any)" />
                        </MapboxMap>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useUiStore } from '~/stores/ui'; // Import UI Store
import { useFormat } from '~/composables/useFormat';
import {
        mapCenter, mapZoom, mapPitch, mapBearing, MAPBOX_LOCALE_KO, MapLangOptions,
        LAYER_3D_BUILDINGS, LAYER_UNCLUSTERED_POINT, LAYER_MINIMAP_POINTS, LAYER_MINIMAP_HEAT
} from '~/context/mapData';

const { locale } = useI18n();
const mapStore = useMapStore();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const uiStore = useUiStore(); // Initialize UI Store
const { getThumbnailUrl } = useFormat();
const mapRef = ref<any>(null);
const miniMapRef = ref<any>(null); // Hoisted

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
                if (layer.type === 'symbol') {
                        const layout = (layer as any).layout;
                        if (layout && layout['text-field']) {
                                if (layer.source === 'composite') {
                                        if (layer.id.includes('label') || layer.id.includes('place') || layer.id.includes('poi')) {
                                                map.setLayoutProperty(layer.id, 'text-field', ['get', fieldName]);
                                                updatedCount++;
                                        }
                                }
                        }
                }
        }
        console.log(`[Container] Language updated to ${fieldName}. Affected layers: ${updatedCount}`);
};

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
                clusterMaxZoom: 14,
                clusterRadius: 50,
        };
});

// DataSource for Searched Markers (Kakao/Google)
const searchedDataSource = computed(() => {
        const markers = mapStore.searchedMarkers;
        const features = markers.map((marker, index) => ({
                type: 'Feature',
                geometry: {
                        type: 'Point',
                        coordinates: [Number(marker.longitude), Number(marker.latitude)]
                },
                properties: {
                        id: `search-${index}`,
                        type: marker.type || 'DEFAULT'
                }
        }));

        return {
                type: 'geojson',
                data: {
                        type: 'FeatureCollection',
                        features: features
                }
        };
});

onMounted(() => {
        // Client-side access token handling if needed
});

const loadMapImages = (map: any) => {
        const images = [
                { name: 'pin', url: '/images/marker_cbre.png' },
                { name: 'redPin', url: '/images/marker_accent.png' },
                { name: 'marker_kakao', url: '/images/marker_kakao.png' },
                { name: 'marker_google', url: '/images/marker_google.png' }
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

// Markers Cache
const markers: Record<string, any> = {};
let markersOnScreen: Record<string, any> = {};

// Use robust composable to capture map instance
useMapbox('cbre-map', async (map) => {
        mapRef.value = map;
        const mapboxgl = await import('mapbox-gl').then(m => m.default || m);

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

                // Update Control Tooltips (Native Mapbox Controls)
                updateControlTooltips();

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
                if (map.isStyleLoaded() && !styleLoaded.value) {
                        console.log('[Container] 1s Backup check triggering style load.');
                        onStyleLoad();
                }
        }, 1000);

        // --- Interactions --- //

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

                new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`
                <div class="w-full h-full p-2 min-w-[200px]">
                    
                        <div class="flex flex-col gap-1">
                            <a href="/property/${props?.propertyId}" target="_blank" rel="noopener noreferrer">
                                <div class="cbre-text-link-arrow font-semibold text-base mb-1">${props?.propertyName}</div>
                            </a>
                            <div class="text-sm text-gray-600">
                                <div>Sector: ${props?.sector}</div>
                                <div>SubSector: ${props?.subSector}</div>
                            </div>
                             <div class="w-full h-[100px] mt-2 rounded overflow-hidden">
                                <img src="${props?.mainImageUrl}" class="w-full h-full object-cover" alt="Property Image" />
                            </div>
                        </div>
                   
                </div>
            `)
                        .addTo(map);
        });

        // Cursor
        const setPointer = () => map.getCanvas().style.cursor = 'pointer';
        const resetPointer = () => map.getCanvas().style.cursor = '';

        map.on('mouseenter', LAYER_UNCLUSTERED_POINT.id, setPointer);
        map.on('mouseleave', LAYER_UNCLUSTERED_POINT.id, resetPointer);

        // --- HTML Cluster Logic --- //
        const updateMarkers = () => {
                if (!map.getSource('cbre-assets')) return;

                const newMarkers: Record<string, any> = {};
                const features = map.querySourceFeatures('cbre-assets');

                for (const feature of features) {
                        const coords = (feature.geometry as any).coordinates;
                        const props = feature.properties;

                        if (!props?.cluster) continue;

                        const id = props.cluster_id;
                        let marker = markers[id];

                        if (!marker) {
                                const el = createHaloCluster(props);
                                el.style.cursor = 'pointer';
                                el.onclick = () => {
                                        const source = map.getSource('cbre-assets') as any;
                                        source.getClusterExpansionZoom(id, (err: any, zoom: number) => {
                                                if (err) return;
                                                map.easeTo({
                                                        center: coords,
                                                        zoom: zoom
                                                });
                                        });
                                };

                                marker = markers[id] = new mapboxgl.Marker({
                                        element: el
                                }).setLngLat(coords);
                        }

                        newMarkers[id] = marker;

                        if (!markersOnScreen[id]) {
                                marker.addTo(map);
                        }
                }

                // Remove markers that are no longer visible
                for (const id in markersOnScreen) {
                        if (!newMarkers[id]) {
                                markersOnScreen[id].remove();
                        }
                }
                markersOnScreen = newMarkers;
        };

        // Update markers on every frame
        map.on('render', () => {
                if (!map.getSource('cbre-assets')) return;
                if (!map.isSourceLoaded('cbre-assets')) return;
                try {
                        updateMarkers();
                } catch (e) {
                        // silent fail or debug log
                }
        });

        // Additional cleanup when data changes effectively
        watch(() => propertyStore.filteredProperties, () => {
                // Clear marker cache to prevent memory leaks as Cluster IDs will change
                Object.keys(markers).forEach(key => delete markers[key]);
        });


        // Notify store that map is ready (important for data fetching/filtering flow)
        propertyStore.initialDataLoaded = true;
});

// Helper: Create Halo Cluster Element
function createHaloCluster(props: any) {
        const count = props.point_count || 0;
        const countAbbr = props.point_count_abbreviated || count;

        // Size calculation based on count
        const size = count >= 1000 ? 60 : count >= 100 ? 50 : count >= 10 ? 40 : 30;

        const el = document.createElement('div');
        el.className = 'cluster-halo';
        el.style.width = `${size + 16}px`; // Halo padding
        el.style.height = `${size + 16}px`;

        const inner = document.createElement('div');
        inner.className = 'cluster-inner';
        inner.style.width = `${size}px`;
        inner.style.height = `${size}px`;
        inner.innerText = countAbbr;

        el.appendChild(inner);

        return el;
}

// Helper: Create Halo Cluster Element
// ... (existing code)

// ...



// Watch for Searched Markers -> Update Map Source
watch(() => searchedDataSource.value, (newData) => {
        if (!mapRef.value) return;
        const source = mapRef.value.getSource('searched-markers');
        if (source) {
                // @ts-ignore
                source.setData(newData.data);
                console.log('[Container] Updated searched-markers source data.');
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
        updateControlTooltips();
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
        // WARNING: Style change might remove markers if source is cleared.
        // We might need to clear markersOnScreen cache.
        for (const id in markersOnScreen) {
                markersOnScreen[id].remove();
        }
        markersOnScreen = {};
});

// Watch for Pitch & Bearing changes (StyleControl)
watch(() => mapStore.mapPitch, (newPitch) => {
        if (mapRef.value) mapRef.value.setPitch(newPitch);
});

watch(() => mapStore.mapBearing, (newBearing) => {
        if (mapRef.value) mapRef.value.setBearing(newBearing);
});


const mapOptions = computed(() => ({
        accessToken: mapboxAccessToken,
        style: 'mapbox://styles/mapbox/light-v11',
        center: mapCenter,
        zoom: mapZoom,
        pitch: mapPitch,
        bearing: mapBearing,
        preserveDrawingBuffer: true, // Required for map export
        attributionControl: false, // Hide attribution
        // UI Localization
        locale: locale.value === 'ko' ? MAPBOX_LOCALE_KO : undefined
}));

// Mini Map Options
// miniMapRef moved to top

const miniMapOptions = computed(() => ({
        accessToken: mapboxAccessToken,
        style: mapStore.selectedMapStyle?.value || 'mapbox://styles/mapbox/light-v11',
        center: [128, 36], // Fixed Center (Korea)
        zoom: 5,
        minZoom: 5,
        maxZoom: 5,
        antialias: true,
        attributionControl: false,
        hash: false,
        interactive: false, // Keep non-interactive
        logoControl: false,
}));

// Initialize Mini Map
// Helper: Update Tooltips for Mapbox Native Controls (DOM Manipulation)
const updateControlTooltips = () => {
        // Map of Selector -> I18n Key
        const tooltipMap = [
                { selector: '.mapboxgl-ctrl-zoom-in', key: 'tooltip.zoom_in' },
                { selector: '.mapboxgl-ctrl-zoom-out', key: 'tooltip.zoom_out' },
                { selector: '.mapboxgl-ctrl-compass', key: 'tooltip.compass' },
                { selector: '.mapboxgl-ctrl-geolocate', key: 'tooltip.geolocate' },
                { selector: '.mapboxgl-ctrl-fullscreen', key: 'tooltip.fullscreen' },
                // Export Control (might be the button itself or container)
                { selector: '.mapboxgl-ctrl-export button', key: 'tooltip.export' },
                { selector: '.mapbox-gl-export-control button', key: 'tooltip.export' },
                // Draw Controls
                { selector: '.mapbox-gl-draw_point', key: 'tooltip.draw_point' },
                { selector: '.mapbox-gl-draw_line_string', key: 'tooltip.draw_line' },
                { selector: '.mapbox-gl-draw_polygon', key: 'tooltip.draw_polygon' },
                { selector: '.mapbox-gl-draw_trash', key: 'tooltip.draw_trash' },
        ];

        // Wait a tick for DOM to settle if called immediately
        setTimeout(() => {
                const { t } = useI18n(); // Ensure we get the latest translator if needed, though global t is fine in setup

                tooltipMap.forEach(({ selector, key }) => {
                        const els = document.querySelectorAll(selector);
                        els.forEach(el => {
                                if (el instanceof HTMLElement) {
                                        el.setAttribute('title', t(key));
                                }
                        });
                });
                console.log('[Container] Updated Mapbox Control Tooltips');
        }, 1000); // 1s delay to safely catch lazy loaded controls
};

// Initialize Mini Map
const miniMapMarkers: Record<string, any> = {};
let miniMapMarkersOnScreen: Record<string, any> = {};

// Helper: Create Mini Map Halo Cluster (Smaller)
function createMiniMapHaloCluster(props: any) {
        const count = props.point_count || 0;
        const countAbbr = props.point_count_abbreviated || count;
        const size = count >= 1000 ? 30 : count >= 100 ? 25 : count >= 10 ? 20 : 15; // ~50% smaller

        const el = document.createElement('div');
        el.className = 'cluster-halo minimap-halo'; // Add specific class
        el.style.width = `${size + 8}px`;
        el.style.height = `${size + 8}px`;

        const inner = document.createElement('div');
        inner.className = 'cluster-inner';
        inner.style.width = `${size}px`;
        inner.style.height = `${size}px`;
        inner.style.fontSize = '10px'; // Smaller font
        inner.innerText = countAbbr;

        el.appendChild(inner);
        return el;
}

// Update Mini Map Markers
const updateMiniMapMarkers = () => {
        if (!miniMapRef.value) return;
        const map = miniMapRef.value;
        if (!map.getSource('cbre-minimap-points')) return;

        const newMarkers: Record<string, any> = {};
        // Query features from the rendered source
        const features = map.querySourceFeatures('cbre-minimap-points');

        for (const feature of features) {
                const coords = (feature.geometry as any).coordinates;
                const props = feature.properties;

                if (!props?.cluster) continue;

                const id = props.cluster_id;
                let marker = miniMapMarkers[id];

                if (!marker) {
                        const el = createMiniMapHaloCluster(props);
                        // @ts-ignore
                        marker = miniMapMarkers[id] = new mapboxgl.Marker({
                                element: el
                        }).setLngLat(coords);
                }

                newMarkers[id] = marker;

                if (!miniMapMarkersOnScreen[id]) {
                        marker.addTo(map);
                }
        }

        // Cleanup
        for (const id in miniMapMarkersOnScreen) {
                if (!newMarkers[id]) {
                        miniMapMarkersOnScreen[id].remove();
                }
        }
        miniMapMarkersOnScreen = newMarkers;
};

useMapbox('cbre-minimap', (map) => {
        miniMapRef.value = map;
        console.log('[Container] Mini Map initialized (Static).');

        map.on('render', () => {
                if (!map.isSourceLoaded('cbre-minimap-points')) return;
                updateMiniMapMarkers();
        });
});

// Adjust Heatmap Style based on Data Count
const updateHeatmapVisuals = (count: number) => {
        if (!miniMapRef.value) return;
        const layerId = 'cbre-minimap-heat-layer';
        if (!miniMapRef.value.getLayer(layerId)) return;

        // Heuristic Logic for Visual Consistency @ Zoom 5
        // Since we now have Clusters, we can reduce Heatmap intensity slightly to avoid clash
        // Or keep it as a background glow
        let intensity = 1;
        let radius = 10;

        if (count === 0) {
                intensity = 0;
        } else if (count <= 30) {
                intensity = 0; // Hide heatmap if very few items, show clusters/points only?
                // Actually, consistency: Keep heatmap as "glow"
                intensity = 2;
                radius = 20;
        } else if (count <= 100) {
                intensity = 2;
                radius = 20;
        } else if (count <= 500) {
                intensity = 1.5;
                radius = 15;
        } else {
                intensity = 0.5;
                radius = 10;
        }

        miniMapRef.value.setPaintProperty(layerId, 'heatmap-intensity', intensity);
        miniMapRef.value.setPaintProperty(layerId, 'heatmap-radius', radius);
};

// Watch for property data changes -> Update Map Source & Heatmap Style
watch(() => propertyStore.filteredProperties, () => {
        if (!mapRef.value) return;
        const source = mapRef.value.getSource('cbre-assets');
        if (source) {
                // @ts-ignore
                source.setData(cbreDataSource.value.data);
                console.log('[Container] Updated cbre-assets source data.');
        }

        // 💡 [Sync] Update Mini Map Source & Style
        if (miniMapRef.value) {
                const miniMapSource = miniMapRef.value.getSource('cbre-minimap-points');
                if (miniMapSource) {
                        // @ts-ignore
                        miniMapSource.setData(cbreDataSource.value.data);
                        console.log('[Container] Updated cbre-minimap-points source data.');

                        // Apply dynamic visual adjustments
                        const count = propertyStore.filteredProperties.length;
                        updateHeatmapVisuals(count);
                }
        }
}, { deep: true });

</script>


<style>
/* Halo Cluster Styling */
.cluster-halo {
        background-color: rgba(0, 63, 45, 0.4);
        /* CBRE Green 40% Opacity */
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
        animation: pulse 2s infinite;
}

.cluster-halo:hover {
        background-color: rgba(0, 63, 45, 0.6);
        transform: scale(1.1);
}

.cluster-inner {
        background-color: #003F2D;
        /* CBRE Green Solid */
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-family: 'Outfit', sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes pulse {
        0% {
                box-shadow: 0 0 0 0 rgba(0, 63, 45, 0.4);
        }

        70% {
                box-shadow: 0 0 0 10px rgba(0, 63, 45, 0);
        }

        100% {
                box-shadow: 0 0 0 0 rgba(0, 63, 45, 0);
        }
}

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
