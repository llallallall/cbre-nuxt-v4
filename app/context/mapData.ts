// app/context/mapData.ts

export const mapStyleId: string = 'light-v11';
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
        'text-font': ['Arial Unicode MS Bold'],
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
        'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['coalesce', ['get', 'mag'], 1],
            0,
            0,
            1,
            0.1, // Significantly reduced weight for single points (mag=1)
            6,
            1
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
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(23, 232, 143, 0)', // Transparent
            0.2,
            'rgba(23, 232, 143, 0.5)', // Light green #17E88F
            0.6,
            'rgba(1, 142, 105, 0.8)', // Medium green #018e69
            1,
            'rgba(0, 63, 45, 1)' // Dark green #003F2D
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            2,
            5,
            10, // Reduced radius at zoom 5 to make single points smaller
            9,
            30
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

// Map Style Options
export const MapStyle = [
    { name: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
    { name: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
    { name: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
    { name: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12' },
    { name: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
    { name: 'SatelliteStreets', value: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { name: 'NavigationDay', value: 'mapbox://styles/mapbox/navigation-day-v1' },
    { name: 'NavigationNight', value: 'mapbox://styles/mapbox/navigation-night-v1' },
];

export const MapLang = [
    { name: 'English', value: 'en' },
    { name: 'Korean', value: 'ko' },
];

export const MapDefaultOptions = {
    MapStyle: MapStyle[0],
    MapLang: MapLang[0],
    MapRatio: 60,
    MapPitch: 10,
    MapBearing: 0,
};

export type MapDefaultOptionsType = typeof MapDefaultOptions;
