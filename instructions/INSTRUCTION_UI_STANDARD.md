# UI Standardization Instruction

## Overview
This project uses `@nuxt/ui` and follows the CBRE Design System.
Reference: https://ui.nuxt.com/docs/getting-started/theme/components

## Guidelines
1. **Design System**: Follow `DESIGN_GUIDELINES.md`.
2. **Nuxt UI Components**: Use `UButton`, `UCard`, `UModal`, etc. instead of custom implementations where possible.
3. **App Config**:
   - Maintain consistency in `app.config.ts`.
   - **Rounded Corners**: Use `rounded-none` for all components to match CBRE brand.
   - **Colors**: Use `primary` (cbre-green) and `neutral` (gray).
4. **Icons**: Use `UIcon` with `i-heroicons-...` or other collections.
5. **Modals & Toasts**:
   - Use `UModal` for modals.
   - Use `useToast` (from `@nuxt/ui`) for notifications.
6. **Class Usage**:
   - Avoid `rounded` in `ui` prop if it causes type errors. Use `class="rounded-none"` or the component's `rounded` prop.
   - Use `ui` prop only for overriding internal slots or specific theme keys not exposed as props.
7. **UAccordion**:
   - Use `slot: 'content'` in items and `<template #content>` for custom body content to avoid type errors with the default `#item` slot.
