/**
 * @description 지도상의 핀 좌표 및 줌 레벨 정의
 */
export interface Coordinate {
    latitude: number;
    longitude: number;
    zoom?: number;
    speed?: number;
    curve?: number;
}

/**
 * @description Map Store의 상태 정의
 * 
 */
export interface MapState {

    // 1. UI 상태
    keepStateMiniMap: boolean;
    filterMapPins: boolean;

    // 2. 지도 컨트롤 상태
    flyTo: boolean;
    pinCoordinate: Coordinate;
    mapLanguagePlugin: any;

    // 3. 지도 스타일/설정
    mapStyleId: string;
    selectedMapStyle: MapOptionStyle;
    mapStyleOptions: MapOptionStyle[];
    selectedMapLanguage: MapOptionStyle;
    mapLanguageOptions: MapOptionStyle[];
    mapRatio: number;
    mapPitch: number;
    mapBearing: number;


    // 4. 검색 결과 (Kakao, Google Geocoder)
    searchedMarkers: Coordinate[];
    searchedMarkersChanged: number;
    kakaoAddress: any[];
    kakaoKeyword: any[];
    googleGeocoder: any[];

}

export interface MapOptionStyle {
    label: string,
    value: string,
    id?: string,
    avatar: {
        src: string,
        alt: string
    }
} 
