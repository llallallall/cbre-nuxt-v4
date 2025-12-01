# Performance Optimization Guidelines

## Overview
Guidelines for using Nuxt 4 performance modules (`nuxt/image`, `nuxt/icon`, `nuxt/fonts`, `nuxt/scripts`).

## Guidelines
1. **Images**:
   - Use `<NuxtImg>` for all images.
   - Configure `provider` correctly (e.g., `ipx` or external).
   - Use `format="webp"` and `loading="lazy"` where appropriate.
2. **Icons**:
   - Use `<UIcon>` or `<Icon>`.
   - Avoid importing SVG files directly as components if possible.
3. **Fonts**:
   - Use `@nuxt/fonts` module.
   - Place local fonts in `public/fonts` if needed, but prefer module handling.
4. **Scripts**:
   - Use `useScript` from `@nuxt/scripts` for third-party scripts (e.g., Google Maps, Analytics).
   - Load scripts with appropriate strategies (`client`, `lazy`, `delay`).
