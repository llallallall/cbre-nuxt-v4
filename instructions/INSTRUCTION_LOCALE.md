# Internationalization (i18n) Strategy & Progress Tracker

This document outlines the strategy for implementing internationalization in the `cbre-nuxt-v4` project and serves as a central tracker for progress.

## Strategy

### 1. Hybrid Approach
We leverage both `@nuxt/ui` capabilities and `@nuxtjs/i18n`.

*   **@nuxt/ui Components**:
    *   **Goal**: Maximize the use of built-in component features for UI elements.
    *   **Action**: For props that accept string labels (e.g., `label`, `placeholder`, `aria-label`), always bind them to the i18n instance using the `$t()` function.
    *   **Automation**: While Nuxt UI components don't "auto-translate" custom app content, they provide the structure. We must supply the localized strings.

*   **@nuxtjs/i18n**:
    *   **Goal**: Handle all custom text content, headings, descriptions, and dynamic data labels.
    *   **Location**:
        *   English: `i18n/locales/en.json`
        *   Korean: `i18n/locales/ko.json`
    *   **Usage**: Use `{{ $t('key') }}` in templates and `const { t } = useI18n()` in scripts.

### 2. Implementation Guidelines
1.  **Check**: Open a Vue file from the tracker list.
2.  **Scan**: Identify hardcoded text strings (English or Korean).
3.  **Extract**:
    *   Create a logical key structure in `en.json` and `ko.json` (e.g., `page.login.title`).
    *   Add the text to both files.
4.  **Replace**: Update the Vue file to use `$t('page.login.title')`.
5.  **Mark**: Update the [Progress Tracker](#progress-tracker) below.

---

## Progress Tracker

**Legend**:
*   `[ ]` Pending
*   `[/]` In Progress
*   `[x]` Completed (Fully Localized)

### Layouts (`app/layouts`)
- [x] `default.vue`
- [x] `admin-layout.vue`
- [x] `page-layout.vue`

### Pages (`app/pages`)
- [x] `app.vue` (Root Layout/Modals)
- [ ] `index.vue` (Home/Search)
- [ ] `login.vue`
- [ ] `signup.vue`
- [ ] `admin.vue`
- [ ] `property/index.vue`
- [x] `property/[id].vue`

### Components: Navigation (`app/components/nav`)
- [x] `TopBar.vue`
- [ ] `MoreMenu.vue`
- [ ] `TextSearchPannel.vue`
- [ ] `mobile/FilterPannel.vue`
- [ ] `mobile/MobileMenu.vue`

### Components: Property (`app/components/property`)
- [ ] `PropertyCard.vue` (and related list items)
- [x] `PropertyDetail` components

### Components: Common/Demo
- [x] `LanguageSwitcher.vue`
- [x] `demo/TypographyDemo.vue`
- [ ] `common/Footer.vue` (if exists)

---

## Key Naming Convention
*   **Global/Common**: `common.cancel`, `common.confirm`, `common.search`
*   **Navigation**: `nav.menu.home`, `nav.filter.size`
*   **Page Specific**: `login.title`, `signup.form.email`
*   **Enums/Types**: `property.type.office`, `property.status.active`
