# Migration History & Decisions

## Overview
This document tracks major migration decisions, component renames, and standardization choices to prevent regressions and ensure consistency across agents/PCs.

## Component Renames / Replacements
- **InfoModal** -> `app/components/map/SelectedInfoPanel.vue`
  - Reason: Better naming and structural organization.
- **MapContainer** -> `app/components/map/Container.vue`
- **ListCard** -> `app/components/list/Card.vue`

## Standardization Decisions
- **Modals**: Use `UModal` (Nuxt UI). Deprecate custom modal implementations.
- **Toasts**: Use `useToast` (Nuxt UI). Deprecate custom toast stores/composables.
- **Icons**: Standardize on `UIcon` with `heroicons` collection.

## Configuration Fixes
- **Nuxt Security**: Fixed `csrf` configuration in `nuxt.config.ts`.
  - Removed invalid `excludedUrls` property from `csrf` object.
  - Implemented `routeRules` to disable CSRF for `/api/_nuxt_icon/**`.
  - Enabled CSRF globally (`csrf: true`).

## Rollback Prevention
- **DO NOT** revert `SelectedInfoPanel` back to `InfoModal`.
- **DO NOT** re-introduce `useAuth` from `@sidebase/nuxt-auth`. Use `nuxt-auth-utils`.

## Recent Fixes & Features (2025-12-05)
- **SelectedInfoModal Visibility**:
  - **Issue**: Modal appeared on initial load despite `show` prop being false.
  - **Fix**: Renamed `SelectedInfoPanel` -> `SelectedInfoModal` to clear caching/hydration mismatches. Wrapped in `<ClientOnly>` with `v-if` guard in `app.vue`.
  - **Rule**: Always use `SelectedInfoModal` with explicit visibility guards.

- **TopBar Restoration & Styling**:
  - **Color**: Fixed `cbre-green` in `tailwind.config.ts` (added `DEFAULT: '#003F2D'`).
  - **Features**: Restored "SubSector", "More" menu, and "User" menu from v2.
  - **Interaction**: Implemented `cbre.com` style:
    - Hover/Open: White Background / Dark Green Text (`text-cbre-green`).
    - **UserMenu**: Adapts text/icon color dynamically based on TopBar state (`isLightMode`).

- **500 Server Error & CSP Resolution**:
  - **Issue**: `html.replace is not a function` 500 error during SSR.
  - **Cause**: `nuxt-mapbox` module was disabled, and `nuxt.config.ts` had syntax errors/misplaced blocks.
  - **Fix**: Enabled `nuxt-mapbox`, fixed `nuxt.config.ts` syntax, and verified `nuxt-security` works with correct CSP settings.

- **TopBar Refactoring (Mobile)**:
  - **Change**: Moved mobile-specific components (`TextSearchPannel`, `FilterPannel`) to `app/components/nav/mobile/`.
  - **Logic**: Used `@nuxtjs/device` (`isMobile`, `isMobileOrTablet`) for conditional rendering instead of just CSS classes.
  - **Benefit**: Improved performance by avoiding rendering of mobile components on desktop.

- **DrawControl Enhancements**:
  - **Features**: Added area (polygon) and length (line) calculation.
  - **UI**: Restored calculation box visibility.
  - **Note**: Circle drawing was reverted due to `mapbox-gl-draw-circle` security vulnerabilities.

