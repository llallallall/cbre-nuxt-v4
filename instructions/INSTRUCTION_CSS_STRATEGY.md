# CSS & Tailwind Strategy

## Overview
Guidelines for maintaining consistent styling and reusing `main.css`.

## Guidelines
1. **Global Styles**:
   - Use `app/assets/css/main.css` for global styles and utility classes.
   - Do not duplicate global styles in component `<style>` blocks.
2. **Tailwind CSS**:
   - Use Tailwind utility classes for layout and spacing.
   - Use `app.config.ts` for theme colors and defaults.
3. **Nuxt UI Colors**:
   - **DO NOT use `gray`** for Nuxt UI component colors (e.g., `<UButton color="gray">`).
   - Use **`neutral`** instead of `gray` (e.g., `<UButton color="neutral">`).
   - Allowed colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `cbre-green`, `neutral`.
4. **Cleanup**:
   - Remove unused CSS classes.
   - If a class is named but empty, define it in `main.css` or remove it.
5. **Identity**:
   - Maintain CBRE identity (Green, Squared).
   - Use `text-cbre-green` and `bg-cbre-green` utilities.
