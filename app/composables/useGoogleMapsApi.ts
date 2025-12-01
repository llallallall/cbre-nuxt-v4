/**
 * @file useGoogleMapsApi.ts
 * @description Composable to asynchronously load Google Maps JavaScript API.
 */

import { useRuntimeConfig } from '#app';

declare global {
        interface Window {
                initGoogle: (() => void) | undefined;
                google: typeof google | undefined;
        }
}

declare const google: {
        maps: {
                [key: string]: any;
        };
        [key: string]: any;
};

let googleMapsPromise: Promise<typeof google.maps> | null = null;

export default function useGoogleMapsApi(): Promise<typeof google.maps> {
        const config = useRuntimeConfig();

        if (googleMapsPromise) {
                return googleMapsPromise;
        }

        googleMapsPromise = new Promise((resolve, reject) => {
                const apiKey = config.public.googleApiToken;

                if (!apiKey) {
                        return reject(new Error("Google Maps API Key (googleApiToken) is missing in runtime config."));
                }

                if (typeof window.google?.maps !== 'undefined') {
                        return resolve(window.google.maps);
                }

                if (typeof window === 'undefined') {
                        googleMapsPromise = null;
                        return reject(new Error("Cannot load Google Maps API on the server side (SSR)."));
                }

                window.initGoogle = () => {
                        if (window.google?.maps) {
                                resolve(window.google.maps);
                        } else {
                                reject(new Error("Google Maps API callback executed, but google.maps object is missing."));
                        }
                        delete window.initGoogle;
                };

                const link =
                        'https://maps.googleapis.com/maps/api/js?key=' +
                        apiKey +
                        '&loading=async' +
                        '&callback=initGoogle' +
                        '&region=KR' +
                        '&language=en' +
                        '&libraries=places,marker'; // Added marker library

                const googleScript = document.querySelector(
                        `script[src^="https://maps.googleapis.com/maps/api/js?key=${apiKey.substring(0, 5)}"]`
                );

                if (!googleScript) {
                        const newScript = document.createElement('script') as HTMLScriptElement;
                        newScript.src = link;
                        newScript.async = true;
                        document.head.append(newScript);

                        newScript.addEventListener('error', (e) => {
                                googleMapsPromise = null;
                                reject(new Error(`Google Maps API failed to load: ${e}`));
                        });
                }
        });

        return googleMapsPromise;
}
