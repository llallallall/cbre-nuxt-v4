<template>
        <div ref="mapDrawRef" :class="isMounting ? 'hidden' : 'block'"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMapbox } from '#imports';
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const mapDrawRef = ref(null);
const isMounting = ref(true);

onMounted(() => {
        isMounting.value = true;
        useMapbox('cbre-map', (map) => {
                if (mapDrawRef.value) {
                        const Draw = new MapboxDraw({
                                displayControlsDefault: false,
                                controls: {
                                        polygon: true,
                                        trash: true
                                },
                        });
                        map.addControl(Draw, "top-right");
                }
        });
        setTimeout(() => { isMounting.value = false; }, 1000);
});
</script>
