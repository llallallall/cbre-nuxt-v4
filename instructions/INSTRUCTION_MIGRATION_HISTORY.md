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
