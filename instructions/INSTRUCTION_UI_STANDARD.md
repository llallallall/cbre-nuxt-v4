# UI Standardization Instruction & Design System

## 1. Overview
This document enforces the **CBRE Design System** and **Nuxt UI** standards for the project. It serves as the single source of truth for UI implementation.

## 2. Core Directives (Agent Priority)
1.  **Brand Alignment**: Must align identity with `cbre.com` (Client) and maintain strict consistency.
2.  **CSS Reuse**: Maximize usage of existing classes in `main.css`. Only add new classes when absolutely necessary (inevitable cases).
3.  **Documentation Sync**: If a new class is added:
    - You **MUST** update `app/components/demo/TypographyDemo.vue` to visualize it.
    - You **MUST** update `INSTRUCTION_UI_STANDARD.md` to document it if reusable.
4.  **Change Logging**: Any modification to `main.css`, `tailwind.config.ts`, or `app.config.ts` **MUST** be logged in `INSTRUCTION_DEV_LOG.md` to ensure recoverability.

## 3. Project Structure
Strictly follow the Nuxt 4 `app/` directory structure.

- **`app/components/`**: All Vue components.
    - **`nav/mobile/`**: Mobile-specific navigation components (`FilterPannel`, `textSearchPannel`).
- **`app/layouts/`**: Layout files.
- **`app/assets/css/`**: Global styles (`main.css`).
- **`app/app.config.ts`**: Runtime UI configuration (colors, defaults).

---

## 3. Performance & Optimization
Guidelines for using Nuxt 4 performance modules.

- **Images**:
  - Use `<NuxtImg>` for all images.
  - Configure `provider` correctly (e.g., `ipx` or external).
  - Use `format="webp"` and `loading="lazy"`.
- **Icons**:
  - Use `<UIcon>` or `<Icon>`.
  - Avoid importing SVG files directly.
- **Fonts**:
  - Use `@nuxt/fonts` module.
- **Scripts**:
  - Use `useScript` from `@nuxt/scripts` for third-party scripts (Google Maps, Analytics).
  - Load with `client`, `lazy`, or `delay` strategies.

---

## 4. Design System
CBRE Identity: **Green, Squared, Professional**.

### A. Color System
- **Primary**: `cbre-green` (#003F2D) - Headers, Primary Buttons.
- **Accent**: `cbre-accent` (#17E88F) - Hover states, Active indicators.
- **Text**: `cbre-slate` (#435254) - Body text.
- **Backgrounds**: `cbre-dark` (#012A2D) for footers/dark sections.

**Usage**: Use Tailwind utility classes (`text-cbre-green`, `bg-cbre-accent`) or CSS variables (`var(--eds-color-primary-1)`).

### B. Typography
- **Headings (Serif)**: `Financier Display`. Use classes `.cbre-text-h1`, `.cbre-text-h2`, `.cbre-text-h3`.
- **Body & UI (Sans)**: `Calibre`. Use classes `.cbre-text-body`, `.cbre-text-label`.
- **Contrast**: Avoid light grey text on white. Ensure high contrast.

### C. Layout & Spacing
- **Container Max Width**: `1440px`.
- **Spacing**: Generous whitespace. Section gap 80-120px, Component gap 24-32px.

---

## 4. UI Components & Usage
Use **Nuxt UI** components preferentially over custom implementations.

### A. Core Components
| Component | Style Rule | Nuxt UI Replacement |
| :--- | :--- | :--- |
| **Buttons** | **Squared** (`rounded-none`). Primary: Green/White. | `<UButton color="primary" variant="solid" />` |
| **Cards** | **Squared**. No shadow by default, shadow-lg on hover. | `<UCard :ui="{ rounded: 'rounded-none' }" />` |
| **Inputs** | **Squared**. Bottom border or full border. | `<UInput variant="outline" :ui="{ rounded: 'rounded-none' }" />` |
| **Modals** | **Squared**. | `<UModal v-model:open="isOpen">` |

### B. App Configuration (`app.config.ts`)
Global defaults are configured to match CBRE brand. Do not override efficiently unless necessary.
```typescript
export default defineAppConfig({
  ui: {
    primary: 'cbre-green',
    gray: 'cool',
    button: { rounded: 'rounded-none' },
    input: { rounded: 'rounded-none' },
    card: { rounded: 'rounded-none' }
  }
})
```

### C. Specific Patterns
- **PDF Viewer**: Use `<LazyPdfViewer />` (See `INSTRUCTION_PDF_VIEWER.md`).
- **Navigation**:
    - **Desktop**: Dark Green bg, White text.
    - **Mobile**: Use specialized panels in `app/components/nav/mobile/`. Use `@nuxtjs/device` for conditional rendering.

---

## 5. CSS Strategy Integration
To maintain consistenty and predictability, all custom CSS classes in `main.css` must follow these rules.

### A. Naming Convention (Kebab-Case)
`cbre-[Category]-[Function/Module]-[Element/State]-[Modifier]`

| Segment | Description | Examples |
| :--- | :--- | :--- |
| **Namespace** | Always `cbre-` to prevent conflicts. | `cbre-` |
| **Category** | High-level component type. | `button`, `text`, `panel`, `layout`, `nav`, `list`, `font`, `transition`, `form`, `badge`, `table`, `overlay`, `avatar`, `status` |
| **Function** | Specific purpose (Optional). | `action`, `search`, `brand`, `topbar` |
| **Element** | Sub-component or part (Optional). | `title`, `container`, `icon`, `row`, `cell` |
| **Modifier** | Variant or state (Optional). | `primary`, `sm`, `active`, `danger`, `success` |

**Examples**:
- `cbre-button-action-danger`
- `cbre-panel-header`

### B. Standardization Dictionary
| Concept | Standard Term | Forbidden Terms |
| :--- | :--- | :--- |
| **Button** | `button` | `btn`, `btn-wrapper` |
| **Text** | `text` | `string`, `txt` |
| **Font** | `font` | - |
| **Navigation** | `nav` | `menu`, `gnb` |
| **Panel** | `panel` | `card`, `box`, `container`* |

### C. Z-Index Strategy
Prevent layering wars by adhering to this semantic scale.

| Level | Range | Tailwind Utility | Usage Scenario |
| :--- | :--- | :--- | :--- |
| **Deep** | `-1` | `-z-1` | Backgrounds |
| **Base** | `0` | `z-0` | Standard Content |
| **Lifted** | `10` | `z-10` | Badges, Floating Actions |
| **Dropdown** | `20` | `z-20` | Tooltips, Local Dropdowns |
| **Sticky** | `30` | `z-30` | Sticky Headers |
| **Panel** | `40` | `z-40` | Sidebars, Slide-out Panels |
| **App Shell** | `50` | `z-50` | **TopBar**, Main Navigation |
| **Overlay** | `60` | `z-[60]` | Backdrops, Mobile Menu |
| **Modal** | `70` | `z-[70]` | Dialogs |
| **Popover** | `80` | `z-[80]` | Select Menus |
| **Toast** | `90` | `z-[90]` | Notifications |
| **Critical** | `100` | `z-[100]` | Loading Spinners, Error Curtains |

**Rule**: Do NOT use arbitrary z-index values (e.g., `z-[999]`). Stick to this table.

---

## 6. Implementation Checklist
1.  **Check `main.css`**: Is the class defined globally?
2.  **Check Strategy**: Does the class name follow `cbre-*`?
3.  **Check Nuxt UI**: Can I use `<UButton>` instead of `<div class="btn">`?
4.  **Check Responsive**: Is mobile view optimized?
