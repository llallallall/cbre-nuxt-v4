// stores/ui.ts

// 화면 흐름 / 설정: Admin 패널 상태(isOpen, currentSection), 메뉴 오버레이, Grid / List 설정, 마스터 데이터(Sector, Subsector 등)

import { defineStore } from 'pinia';

// ----------------------------------------------------------------------
// 1. 타입 정의 (UI, Admin Panel, Master Data)
// ----------------------------------------------------------------------

/**
 * @description 관리자 수정 패널에 표시할 섹션의 타입을 정의합니다.
 * (기존 modifyPanel.ts에서 가져옴)
 */
export type AdminModifySectionType =
    'general' |
    'profitability' |
    'history' |
    'location' |
    'scale' | // 'sizes' -> 'scale'로 명칭 통일 권장
    'accessibility' |
    'facility' |
    'parking' |
    'floor' |
    'floorplan' |
    'sale' |
    'lease' |
    'photo' | // 파일 목록
    'brochure' |
    null;

/**
 * @description Sector/Subsector 등 코드성 마스터 데이터의 타입
 */
export interface MasterDataType {
    id: string;
    name: string;
    // 서브 섹터의 경우, 부모 섹터 ID가 필요할 수 있음.
    sectorId?: string;
}

/**
 * @description UI Store의 상태(State) 정의
 */
interface UiState {
    // 1. Admin 수정 패널 상태 (Admin Panel State)
    isModifyPanelOpen: boolean;
    currentSection: AdminModifySectionType;
    currentPropertyIdToModify: string | null;

    // 미리보기 크기 조정 관련 상태
    isOpenPreview: boolean,
    isOpenModifyPanel: boolean,
    isGrownPreview: boolean,

    // 2. 메뉴 및 오버레이 상태 (Menu & Overlay State)
    isMenuOverlay: boolean;
    isSearchModalOverlay: boolean;
    isLogoutOverlay: boolean;
    isDetailModalOpened: boolean; // 자산 상세 정보 모달(새 창 대체 가능성 고려)

    // 3. 리스트 표시 설정 (List View Settings)
    isGridView: boolean; // Grid / List 뷰 전환
    isHiddenList: boolean; // 리스트 숨김/보임 (지도와 함께 표시될 때)
    isExpandedList: boolean; // 리스트 확장 여부 (50% 너비)

    // 4. 마스터 데이터 (Master Data)
    sectorList: MasterDataType[];
    subsectorList: MasterDataType[];
    temperatureList: MasterDataType[];

    // 5. 다국어 지원을 위한 현재 로케일 상태 추가 (i18n 모듈과 연동)
    currentLocale: 'en' | 'ko'; // 현재 언어 설정

    // 사용자 프로필 모달
    isUserProfileModalOpen: boolean;

    // Fab 버튼
    isFabOpen: boolean;
    showInfoModal: boolean;

    // Tooltip Setting
    showTooltips: boolean;

    // map
    showMiniMap: boolean,

    // Header Color Mode
    isLightMode: boolean;

    // Docs Modal
    showDocsModal: boolean;

    // Device State
    isMobile: boolean;
    isTablet: boolean;
}

// ----------------------------------------------------------------------
// 2. 초기 상태 정의 (Initial State)
// ----------------------------------------------------------------------

const getInitialState = (): UiState => ({
    // Admin 수정 패널 초기 상태
    isModifyPanelOpen: false,
    currentSection: null,
    currentPropertyIdToModify: null,

    isOpenPreview: false,   // 좌측 preview 화면
    isOpenModifyPanel: false,   // 우측 form 화면    
    isGrownPreview: false,  // 좌측 preview 화면이 확장된 상태

    // 메뉴 및 오버레이 초기 상태
    isMenuOverlay: false,
    isSearchModalOverlay: false,
    isLogoutOverlay: false,
    isDetailModalOpened: false,

    // 리스트 표시 초기 설정
    isGridView: true, // 기본은 리스트 뷰
    isHiddenList: false,
    isExpandedList: true,

    // 마스터 데이터 초기 상태
    sectorList: [],
    subsectorList: [],
    temperatureList: [],

    currentLocale: 'en', // 기본은 영어
    isUserProfileModalOpen: false,

    isFabOpen: false,
    showInfoModal: false,

    showTooltips: true, // Default enabled

    showMiniMap: true,

    // Header Color Mode
    isLightMode: false,

    showDocsModal: false,

    // Device State
    isMobile: false,
    isTablet: false,
});

// ----------------------------------------------------------------------
// 3. Pinia Store 정의 (useUiStore)
// ----------------------------------------------------------------------

export const useUiStore = defineStore('ui', {
    state: getInitialState,

    actions: {
        // ------------------- A. Admin 수정 패널 액션 -------------------

        /**
         * @description Admin 수정/생성 패널을 열고, 수정할 자산 ID와 시작 섹션을 설정합니다.
         * @param propertyIdToModify - 수정할 자산의 ID (생성 시 null)
         * @param section - 패널을 열 때 기본으로 표시할 섹션 ('general'이 기본값)
         */
        openModifyForm(
            propertyIdToModify: string | null, // 💡 첫 번째 인자: 수정할 자산 ID
            section: AdminModifySectionType = 'general' // 💡 두 번째 인자: 열 섹션 (기본값 설정)
        ) {
            // 1. 수정/생성 모드에 따라 자산 ID 설정
            // 상태 변수 명칭: currentPropertyIdToModify
            this.currentPropertyIdToModify = propertyIdToModify;

            // 2. 패널 섹션 설정 (예: general, profitability 등)
            // 상태 변수 명칭: currentModifySection
            this.currentSection = section;

            // 3. 패널 열기
            // 상태 변수 명칭: isOpenPreview
            this.isOpenPreview = true;

            // 4. Preview 크기 및 패널 상태 설정
            if (section) {
                // 섹션이 있음 (Create Mode or Direct Edit): 패널 열기, Preview 축소 (좌측 정렬 예정)
                this.openModifyPanel(section);
            } else {
                // 섹션이 없음 (Initial Modify Mode): 패널 닫기, Preview 축소 (중앙 정렬 예정)
                this.isOpenModifyPanel = false;
                this.isGrownPreview = false; // 💡 Shrunk State (Centered)
            }
        },

        closeModifyForm() {
            this.isOpenPreview = false;
            this.isOpenModifyPanel = false;
            this.currentPropertyIdToModify = null;
            this.currentSection = null;
        },

        openModifyPanel(section: AdminModifySectionType) {
            this.isOpenModifyPanel = true;
            this.isGrownPreview = false; // 💡 Shrunk State (Left Aligned when Panel is Open)
            this.currentSection = section;
        },

        closeModifyPanel() {
            this.isOpenModifyPanel = false;
            this.isGrownPreview = false; // 💡 Return to Shrunk State (Centered)
            this.currentSection = null;
        },

        // ------------------- B. UI 토글 및 설정 액션 -------------------

        /**
         * @description 특정 오버레이 (예: 검색 모달) 상태를 토글합니다.
         * @param target - 'menu' | 'search' | 'logout' | 'detail'
         */
        toggleOverlay(target: 'menu' | 'search' | 'logout' | 'detail') {
            if (target === 'menu') {
                this.isMenuOverlay = !this.isMenuOverlay;
            } else if (target === 'search') {
                this.isSearchModalOverlay = !this.isSearchModalOverlay;
            } else if (target === 'logout') {
                this.isLogoutOverlay = !this.isLogoutOverlay;
            } else if (target === 'detail') {
                this.isDetailModalOpened = !this.isDetailModalOpened;
            }
        },

        /**
         * @description 리스트 뷰의 표시 방식을 전환합니다.
         */
        toggleViewMode() {
            this.isGridView = !this.isGridView;
        },

        /**
         * @description 현재 앱의 언어 설정을 변경합니다. (i18n 모듈과 동기화 필요)
         * @param locale - 변경할 언어 코드
         */
        setLocale(locale: 'en' | 'ko') {
            this.currentLocale = locale;
            console.log('현재 언어 설정을 ' + locale + '로 변경했습니다.');
        },

        /**
         * @description 사용자 프로필 모달의 상태를 토글합니다.
         * @param forceState - 특정 상태(true/false)로 강제 설정 (선택 사항)
         */
        toggleUserProfileModal(forceState?: boolean) {
            this.isUserProfileModalOpen = forceState !== undefined
                ? forceState
                : !this.isUserProfileModalOpen;
        },

        // ------------------- C. 마스터 데이터 액션 -------------------

        /**
         * @description Sector, Subsector 등 마스터 데이터를 서버에서 가져옵니다.
         * (예시: 실제 로직은 API 호출 및 useStatusStore 사용 필요)
         */
        async fetchMasterData() {
            // [TODO]: useStatusStore를 사용하여 로딩 처리 필요
            // const statusStore = useStatusStore();
            // statusStore.setGlobalLoading(true, 'fetchMasterData');

            try {
                // [TODO]: 실제 API 호출 로직 구현
                // 예시: this.sectorList = await $fetch('/api/data/code?record=sector');
            } catch (e) {
                // [TODO]: statusStore.setGlobalError(e.message, 'fetchMasterData');
            } finally {
                // [TODO]: statusStore.setGlobalLoading(false);
            }
        },

        /**
         * @description 헤더의 Light Mode 여부를 설정합니다.
         * @param isLight - true: Light Mode (White bg), false: Dark Mode (Green bg)
         */
        setLightMode(isLight: boolean) {
            this.isLightMode = isLight;
        },

        /**
         * @description 디바이스 상태(Mobile, Tablet)를 설정합니다. (App.vue에서 초기화)
         * @param isMobile 
         * @param isTablet 
         */
        setDeviceState(isMobile: boolean, isTablet: boolean) {
            this.isMobile = isMobile;
            this.isTablet = isTablet;
        },

        /**
         * @description 툴팁 표시 여부를 토글합니다.
         * @param forceValue - 강제 설정 값 (선택 사항)
         */
        toggleTooltips(forceValue?: boolean) {
            this.showTooltips = forceValue !== undefined ? forceValue : !this.showTooltips;

            // Nuxt UI AppConfig를 통해 전역 설정 변경 (Prevent prop)
            const appConfig = useAppConfig();
            // prevent = false -> Enable tooltip
            // @ts-ignore
            appConfig.ui.tooltip.prevent = !this.showTooltips;
        },

        toggleDocsModal(forceValue?: boolean) {
            this.showDocsModal = forceValue !== undefined ? forceValue : !this.showDocsModal;
        }
    },
});
