# CBRE Asset Management System (Nuxt 4)

This project is the next generation of the CBRE Asset Management System, rebuilt with **Nuxt 4** for improved performance, developer experience, and long-term maintainability. It retains the core goal of visualizing and managing real estate properties while adopting a modern tech stack and strict design guidelines.

## 📋 Project Overview

-   **Goal**: Visualize and manage real estate assets on a web platform.
-   **Key Features**:
    -   **Implemented (Foundation)**:
        -   **Nuxt 4 Architecture**: Modular `app/` directory structure.
        -   **Design System**: CBRE branding (Colors, Typography) via Tailwind CSS v4 & Nuxt UI.
        -   **Authentication**: Secure login via `nuxt-auth-utils`.
        -   **Internationalization**: Full English/Korean support via `@nuxtjs/i18n`.
    -   **Planned / In Progress**:
        -   **Interactive Map**: View properties on a map with clustering and filtering capabilities.
        -   **Property List**: Card-style list view of properties synchronized with the map.
        -   **Detail View**: Comprehensive property details (General, History, Floor, Rent, etc.).
        -   **Admin Panel**: CRUD operations for properties.

## 🛠 Tech Stack

-   **Framework**: [Nuxt 4](https://nuxt.com/) (Latest)
-   **UI Library**: [Nuxt UI](https://ui.nuxt.com/) & [Tailwind CSS v4](https://tailwindcss.com/)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **Data Fetching**: [Vue Query](https://tanstack.com/query/latest) (Planned)
-   **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Database**: PostgreSQL
-   **Map**: (Planned) Mapbox GL JS
-   **Auth**: [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
-   **I18n**: [@nuxtjs/i18n](https://i18n.nuxtjs.org/)

## 🎨 Design System

This project strictly follows the **CBRE Design Guidelines**:

-   **Colors**:
    -   Primary: **Forest Green** (`#003F2D`)
    -   Accent: **Bright Green** (`#17E88F`)
    -   Backgrounds: White (`#FFFFFF`) or Light Gray (`#F5F7F7`)
    -   *Note: Dark Mode is currently disabled to maintain strict brand compliance.*
-   **Typography**:
    -   Headings: **Financier Display** (Serif)
    -   Body: **Calibre** (Sans-serif)
    -   Data/Labels: **Barlow Condensed** or **Space Mono**
-   **Components**: Custom UI components built with Nuxt UI, styled to match CBRE guidelines (e.g., `rounded-none` for sharp edges).

## 📂 Project Structure

This project follows the **Nuxt 4** directory structure, keeping all application logic within the `app/` directory.

-   **`app/`**: Main application source code.
    -   `components/`: Reusable Vue components (Nuxt UI based).
    -   `layouts/`: Application layouts (`default`, `admin`, `auth`, `page`).
    -   `pages/`: File-based routing.
    -   `assets/css/`: Global and layout-specific CSS.
    -   `composables/`: Auto-imported composables.
    -   `middleware/`: Route middleware.
    -   `plugins/`: Nuxt plugins.
    -   `app.vue`: Root component.
    -   `error.vue`: Error page.
-   **`server/`**: Server-side logic, API routes, and DB integration.
-   **`prisma/`**: Database schema and migrations.
-   **`public/`**: Static files (fonts, images).
-   **`locales/`**: i18n language files (located at root, not in `app/`).
-   **Configuration Files**:
    -   `nuxt.config.ts`: Main Nuxt configuration.
    -   `tailwind.config.ts`: Tailwind CSS configuration.
    -   `app.config.ts`: Runtime configuration and Nuxt UI theming.

## 📚 Documentation

For more detailed information, please refer to the following documents:

-   **[UI Migration & Nuxt 4 Guide](instructions/INSTRUCTION_UI_MIGRATION.md)**: Detailed guide on the migration to Nuxt 4, directory structure, and UI refactoring.
-   **[Design Guidelines](instructions/DESIGN_GUIDELINES.md)**: Comprehensive guide on the CBRE Design System, including colors, typography, and component usage.
-   **[Address Strategy](instructions/ADDRESS_STRATEGY.md)**: 3-step strategy for address refinement and coordinate conversion.

## 📝 License

[Private / Proprietary]
