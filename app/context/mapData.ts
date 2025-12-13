// app/context/mapData.ts

export const mapStyleId: string = 'streets-v12';
// export const mapAccessToken: string = process.env.MAPBOX_ACCESS_TOKEN as string; // Managed in nuxt.config.ts

export const mapCenter: [number, number] = [127.442, 35.787];
export const mapZoom: number = 6.4;
export const maxZoom: number = 18;
export const minZoom: number = 5;
export const mapPitch: number = 10; // 0 - 85
export const mapBearing: number = 0; // 0 - 360

// 3D Buildings Layer
export const LAYER_3D_BUILDINGS = {
    id: 'add-3d-buildings',
    source: 'composite',
    sourceLayer: 'building',
    filter: ['==', 'extrude', 'true'],
    type: 'fill-extrusion',
    minzoom: 15,
    paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
        ],
        'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.6,
    },
};

// Cluster Layers
export const LAYER_CLUSTERS = {
    id: 'clusters',
    type: 'circle',
    source: 'cbre-assets',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#17E88F',
            10,
            '#018e69',
            20,
            '#003F2D',
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, 10, 30, 20, 40,
        ],
        'circle-opacity': 0.5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
        'circle-stroke-opacity': 1,
    },
};

export const LAYER_CLUSTER_COUNT = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'cbre-assets',
    filter: ['has', 'point_count'],
    layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Arial Unicode MS Bold', 'Noto Sans CJK KR Bold', 'Noto Sans KR Bold', 'sans-serif'],
        'text-size': 12,
    },
    paint: {
        'text-color': '#FFFFFF',
    },
};

export const LAYER_UNCLUSTERED_POINT = {
    id: 'unclustered-point',
    type: 'symbol',
    source: 'cbre-assets',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'icon-image': 'pin',
        'icon-size': 0.7,
        'icon-anchor': 'bottom',
        'icon-ignore-placement': true,
        'icon-allow-overlap': true,
    },
    paint: {},
};

export const LAYER_MINIMAP_POINTS = {
    source: 'cbre-minimap-points',
    id: 'cbre-minimap-points-layer',
    type: 'circle',
    paint: {
        'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            ['interpolate', ['linear'], ['coalesce', ['get', 'mag'], 1], 1, 1, 6, 10], // Reduced radius for single points to 1px
            16,
            ['interpolate', ['linear'], ['coalesce', ['get', 'mag'], 1], 1, 5, 6, 50]
        ],
        'circle-color': [
            'interpolate',
            ['linear'],
            ['coalesce', ['get', 'mag'], 1],
            1,
            'rgba(0,63,45, 0.8)',
            2,
            'rgba(0,63,45, 0.8)',
            3,
            'rgba(0,63,45, 0.8)',
            4,
            'rgba(0,63,45, 0.8)',
            5,
            'rgba(0,63,45, 0.8)',
            6,
            'rgba(0,63,45, 0.8)'
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 0,
        'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            0.2,
            8,
            1
        ]
    }
};

export const LAYER_MINIMAP_HEAT = {
    source: 'cbre-minimap-points',
    id: 'cbre-minimap-heat-layer',
    type: 'heatmap',
    paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        // Heatmap Weight: Clamped to avoid massive clusters overwhelming the map
        'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['coalesce', ['get', 'point_count'], 1],
            0, 0,
            1, 0.15,   // Single item: Low weight to keep it small and sharp
            20, 0.8,   // Small cluster
            100, 1     // Large cluster
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            5,
            2, // Reduced intensity at zoom 5 to prevent single points from being too hot
            9,
            5
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Uses cluster colors: #17E88F (light), #018e69 (medium), #003F2D (dark)
        // Uses tonal variations of CBRE Green #003F2D
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0, 63, 45, 0)',    // Transparent
            0.2,
            'rgba(0, 63, 45, 0.2)',  // Lightest Fade
            0.5,
            'rgba(0, 63, 45, 0.5)',  // Medium Fade
            0.8,
            'rgba(0, 63, 45, 0.8)',  // Strong Fade
            1,
            'rgba(0, 63, 45, 0.95)'   // Deepest CBRE Green
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 10,
            4, 30, // Large radius at mini-map zoom
            6, 50,
            9, 80
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            9,
            0
        ]
    }
};



// Map Options
export const MapStyleOptions = [
    { label: 'Light', value: 'mapbox://styles/mapbox/light-v11', id: 'light-v11', avatar: { src: 'images/mapbox/Light.png', alt: 'Light' } },
    // ...
    { label: 'Standard', value: 'mapbox://styles/mapbox/standard', id: 'standard', avatar: { src: 'images/mapbox/Standard.png', alt: 'Light' } },
    { label: 'StandardSatellite', value: 'mapbox://styles/mapbox/standard-satellite', id: 'standard-satellite', avatar: { src: 'images/mapbox/StandardSatellite.png', alt: 'Light' } },
    { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11', id: 'dark-v11', avatar: { src: 'images/mapbox/Dark.png', alt: 'Dark' } },
    { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12', id: 'streets-v12', avatar: { src: 'images/mapbox/Streets.png', alt: 'Streets' } },
    { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12', id: 'outdoors-v12', avatar: { src: 'images/mapbox/Outdoors.png', alt: 'Outdoors' } },
    { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9', id: 'satellite-v9', avatar: { src: 'images/mapbox/Satellite.png', alt: 'Satellite' } },
    { label: 'SatelliteStreets', value: 'mapbox://styles/mapbox/satellite-streets-v12', id: 'satellite-streets-v12', avatar: { src: 'images/mapbox/SatelliteStreets.png', alt: 'SatelliteStreets' } },
    { label: 'NavigationDay', value: 'mapbox://styles/mapbox/navigation-day-v1', id: 'navigation-day-v1', avatar: { src: 'images/mapbox/NavigationDay.png', alt: 'NavigationDay' } },
    { label: 'NavigationNight', value: 'mapbox://styles/mapbox/navigation-night-v1', id: 'navigation-night-v1', avatar: { src: 'images/mapbox/NavigationNight.png', alt: 'NavigationNight' } },
];

export const MapLangOptions = [
    { label: 'English', value: 'en', avatar: { src: 'images/icons/FlagUS.svg', alt: 'English' } },
    { label: 'Korean', value: 'ko', avatar: { src: 'images/icons/FlagKR.svg', alt: 'Korean' } },
];

export const MAPBOX_LOCALE_KO = {
    'NavigationControl.ZoomIn': '확대',
    'NavigationControl.ZoomOut': '축소',
    'NavigationControl.ResetBearing': '회전 초기화',
    'GeolocateControl.FindMyLocation': '내 위치 찾기',
    'GeolocateControl.LocationNotAvailable': '위치를 찾을 수 없습니다.',
    'LogoControl.Title': 'Mapbox',
    'Map.Title': '지도',
    'AttributionControl.ToggleAttribution': '정보 토글',
    'AttributionControl.MapFeedback': '피드백 보내기',
};
