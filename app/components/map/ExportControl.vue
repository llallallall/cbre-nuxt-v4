<template></template>
<script setup lang="ts">
// props removed
import { onMounted } from 'vue';
import { useMapbox } from '#imports';
import '@watergis/mapbox-gl-export/dist/mapbox-gl-export.css';

onMounted(async () => {
        if (process.client) {
                const MapboxExport = await import('@watergis/mapbox-gl-export');
                useMapbox('cbre-map', (map) => {
                        const exportCtrl = new MapboxExport.MapboxExportControl({
                                PageSize: MapboxExport.Size.A3,
                                PageOrientation: MapboxExport.PageOrientation.Portrait,
                                Format: MapboxExport.Format.PNG,
                                DPI: MapboxExport.DPI[96],
                                Crosshair: true,
                                PrintableArea: true,
                        });
                        map.addControl(exportCtrl, 'top-right');

                        // Dynamic Filename Logic (Merged from 2.depreciated backup)
                        const updateFileName = () => {
                                try {
                                        // Try to read current selection from control options
                                        const ctrl = exportCtrl as any;
                                        const opts = ctrl.options || {};

                                        // Default or current values
                                        let size = (ctrl.pageSize || opts.PageSize || 'Map').toString();
                                        let orient = (ctrl.pageOrientation || opts.PageOrientation || '').toString();
                                        let fmt = (ctrl.format || opts.Format || 'png').toString();

                                        const ext = fmt.toLowerCase();

                                        const now = new Date();
                                        const dateStr = now.getFullYear() +
                                                String(now.getMonth() + 1).padStart(2, '0') +
                                                String(now.getDate()).padStart(2, '0') + '_' +
                                                String(now.getHours()).padStart(2, '0') +
                                                String(now.getMinutes()).padStart(2, '0');

                                        // CBRE_Map_{Size}_{Orient}_{Date}
                                        const newName = `CBRE_Map_${size}_${orient}_${dateStr}`;

                                        // Aggressively set property (keep this as backup)
                                        const paths = [
                                                (c: any) => c.options,
                                                (c: any) => c.config,
                                                (c: any) => c,
                                                (c: any) => c._options,
                                        ];

                                        const keys = ['FileName', 'fileName', 'filename', 'Name', 'name'];

                                        paths.forEach(getPath => {
                                                const target = getPath(ctrl);
                                                if (target) {
                                                        keys.forEach(key => {
                                                                target[key] = newName;
                                                        });
                                                }
                                        });
                                } catch (e) {
                                        console.warn('Update filename properties failed', e);
                                }
                        };

                        // MONKEY PATCH: The library creates an <a> tag and clicks it immediately without appending to DOM.
                        // MutationObserver fails because the node never hits the document body.
                        // We must hijack document.createElement to catch the anchor tag.
                        const originalCreateElement = document.createElement;
                        document.createElement = function (tagName: string, options?: ElementCreationOptions) {
                                const element = originalCreateElement.call(document, tagName, options);
                                if (tagName.toLowerCase() === 'a') {
                                        const anchor = element as HTMLAnchorElement;
                                        // Proxy the click method
                                        const originalClick = anchor.click;
                                        anchor.click = function () {
                                                // Check if it's the map export download
                                                const currentDownload = anchor.download || anchor.getAttribute('download') || '';
                                                if (currentDownload.includes('map') || currentDownload.includes('download')) {
                                                        const ctrl = exportCtrl as any;
                                                        const opts = ctrl.options || {};
                                                        let size = (ctrl.pageSize || opts.PageSize || 'Map').toString();
                                                        let orient = (ctrl.pageOrientation || opts.PageOrientation || '').toString();
                                                        let fmt = (ctrl.format || opts.Format || 'png').toString();
                                                        const ext = fmt.toLowerCase();

                                                        const now = new Date();
                                                        const dateStr = now.getFullYear() +
                                                                String(now.getMonth() + 1).padStart(2, '0') +
                                                                String(now.getDate()).padStart(2, '0') + '_' +
                                                                String(now.getHours()).padStart(2, '0') +
                                                                String(now.getMinutes()).padStart(2, '0');

                                                        const finalName = `CBRE_Map_${size}_${orient}_${dateStr}.${ext}`;

                                                        anchor.download = finalName;
                                                        anchor.setAttribute('download', finalName);
                                                        console.log('[ExportControl] Monkey-patch intercepted click. Renamed to:', finalName);
                                                }
                                                originalClick.apply(this);
                                        };
                                }
                                return element;
                        };

                        // Attach listeners to detect changes/clicks for property updates (still useful for UI state)
                        setTimeout(() => {
                                const container = document.querySelector('.mapboxgl-ctrl-export') || document.querySelector('.mapbox-gl-export-control');
                                if (container) {
                                        ['click', 'mousedown', 'change', 'mouseenter', 'touchstart'].forEach(evt => {
                                                container.addEventListener(evt, updateFileName, { capture: true });
                                        });
                                }
                        }, 1000);
                });
        }
});
</script>
