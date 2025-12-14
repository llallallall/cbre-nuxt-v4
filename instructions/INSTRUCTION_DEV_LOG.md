# Development & Configuration Change Log

This document tracks all modifications to core configuration files (`main.css`, `tailwind.config.ts`, `app.config.ts`) and global definitions. 
**Rule**: Any modification to these files MUST be logged here to ensure recoverability.

## Log Format
- **Date**: YYYY-MM-DD
- **File(s)**: [List of modified files]
- **Description**: Brief explanation of the change.
- **Diff/Action**: What was added/removed (code snippet or summary).

---

## Change Log

### 2025-12-07
- **File(s)**: `app/assets/css/main.css`, `INSTRUCTION_UI_STANDARD.md`
- **Description**: 
    1. Restored missing `.cbre-layout-topbar` class which broke the admin/page layout design.
    2. Added `cbre-badge-circle-*` and `cbre-text-meta` classes to support Search Result UI.
    3. Added "Configuration Change Logging" directive to `INSTRUCTION_UI_STANDARD.md`.
- **Action**:
    - Added `.cbre-layout-topbar` style block.
    - Added `.cbre-badge-circle` styles.
    - Added `.cbre-text-meta` style.

### 2025-12-10
- **File(s)**: `app/pages/index.vue`, `app/components/map/Container.vue`, `instructions/INSTRUCTION_TROUBLESHOOTING.md`
- **Description**:
    1. Fixed Mapbox "Blank Screen" issue on language change (URL change) by preventing component destruction.
    2. Resolved `featureNamespace` console warnings by reverting dynamic language sync for Standard Style.
    3. Documented Mapbox Standard Style known issues.
- **Action**:
    - `index.vue`: Added `key: 'main-map-page'` to `definePageMeta`.
    - `Container.vue`: Removed `useI18n` watcher and `setConfigProperty`.
    - `INSTRUCTION_TROUBLESHOOTING.md`: Added Section 10 "Mapbox GL JS Issues".
    - `Container.vue`: Switched to `light-v11` style to eliminate persistent Standard style errors. **Note**: Global Language Sync is implemented but currently inactive on Light style (requires manual layer handling or plugin for Classic styles).
    - `Container.vue`: **Finalized Language Sync**: Implemented manual layer iteration (`['get', 'name_ko']`) to support `light-v11`. Switched to `useMapbox` to resolve null reference errors. Global `i18n` sync is now fully operational.
    - `mapData.ts`: Reordered `MapStyleOptions` to make `Light` (index 0) the default, aligning `mapStore` with the map component's initial state.
    - `Container.vue`: Enhanced `updateLanguage` with robust `style.load` listeners, direct instance passing, and 1s fallback timeout to resolve refresh race conditions.
    - `StyleControl.vue`: Fixed `color="white"` type error by changing to `neutral`/`bg-white` and refactored to use `UDropdownMenu` for better image support.
    - `ExportControl.vue`: **Fixed Filename Issue**: Reverted to `@watergis/mapbox-gl-export` (library) after native export failed in embedded browser. Implemented `document.createElement` monkey-patch to successfully force dynamic filenames (`CBRE_Map_...`) by intercepting the library's internal download trigger. Added `file-saver` implementation as backup (`.2.depreciated`).


### 2025-12-13
- **File(s)**: `app/components/common/CommonModal.vue`, `app/components/nav/user/*`, `app/stores/ui.ts`, `i18n/locales/*.json`
- **Description**:
    1. **Architecture Change**: Replaced unstable `UModal` with custom `CommonModal.vue` (Teleport-based) to resolve persistent auto-open/overlay issues.
    2. **Feature Implementation**: Completed User Profile (Email display, Password Reset, Avatar Selection with Digital/Office tabs).
    3. **Localization**: Implemented full i18n support for Profile features (`en.json` & `ko.json`).
    4. **Global Feature**: Added "Show Tooltips" global toggle using `USwitch` (replaced `UToggle`).
- **Action**:
    - `CommonModal.vue`: Created new component.
    - `Profile.vue` & `EditProfileModal.vue`: Refactored to use `CommonModal`.
    - `ui.ts`: Added `showTooltips` state and action synced with `appConfig.ui.tooltip.prevent`.
    - `Profile.vue`: Replaced `UToggle` with `USwitch`.
    - `INSTRUCTION_TROUBLESHOOTING.md`: Added section on Nuxt UI Component Compatibility.


### 2025-12-14
- **File(s)**: `app/components/map/Container.vue`, `app/context/mapData.ts`
- **Description**:
    1. **Fullscreen Fix**: Replaced native Mapbox Fullscreen Control with a custom CSS-based pseudo-fullscreen implementation to bypass iframe permission restrictions. Added explicit SVG icons for Enter/Exit feedback.
    2. **Mini Map Refinement**: 
        - Converted Mini Map to a pure **Heatmap** visualization (removed cluster markers/text).
        - Implemented **Adaptive Density Scaling**: Heatmap `intensity` and `radius` now dynamically interpolate based on total asset count (0-1M items).
        - **Visual Distinction**: Applied binary radius sizing (`step` function) to enforce a stark contrast between single items (tiny dot, radius * 0.2) and clusters (full blob, radius * 1.0). Reduced single-item weight to `0.15` to prevent bloom.
    3. **Style Sync**: Linked Mini Map style to Main Map style selector.
    4. **Default Style**: Changed default map style to `streets-v12`.
    5. **Cleanup**: Commented out all map-related console logs in `Container.vue` for cleaner production output.
- **Action**:
    - `Container.vue`: Added `CustomFullscreenControl` class.
    - `Container.vue`: Implemented `updateHeatmapVisuals` with linear interpolation and step-based radius.
    - `mapData.ts`: Updated `LAYER_MINIMAP_HEAT` weights and colors.
    - `Container.vue`: Removed console logs.
