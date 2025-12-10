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

