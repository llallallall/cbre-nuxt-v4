# CBRE Asset Management System (Nuxt 4)

This project is the next generation of the CBRE Asset Management System, rebuilt with **Nuxt 4** for improved performance, developer experience, and long-term maintainability. It retains the core goal of visualizing and managing real estate assets while adopting a modern tech stack and strict design guidelines.

## 📋 Project Overview

-   **Goal**: Visualize and manage real estate assets on a web platform.
-   **Key Features**:
    -   **Interactive Map**: View assets on a map with clustering and filtering capabilities.
    -   **Asset List**: Card-style list view of assets synchronized with the map.
    -   **Detail View**: Comprehensive asset details (General, History, Floor, Rent, etc.).
    -   **Admin Panel**: CRUD operations for assets.
    -   **Authentication**: Secure login via `@sidebase/nuxt-auth`.
    -   **Internationalization**: Full English/Korean support via `@nuxtjs/i18n`.
    -   **CBRE Design System**: Strict adherence to CBRE branding (Colors, Typography, Layouts).

## 🛠 Tech Stack

-   **Framework**: [Nuxt 4](https://nuxt.com/) (Latest)
-   **UI Library**: [Nuxt UI](https://ui.nuxt.com/) & [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **Data Fetching**: [Vue Query](https://tanstack.com/query/latest) (Planned/In-progress)
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: PostgreSQL
-   **Map**: [Nuxt Mapbox](https://nuxt-mapbox.vercel.app/) (Mapbox GL JS)
-   **Auth**: [@sidebase/nuxt-auth](https://sidebase.io/nuxt-auth)
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

## 🚀 Getting Started

### Prerequisites

-   Node.js (Latest LTS)
-   PostgreSQL Database
-   MinIO Server (for file storage)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd cbre-nuxt-v4
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    -   Copy `.env.example` to `.env`.
    -   Configure your database URL, Auth secret, and other environment variables.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:3000`.

## 📂 Project Structure

-   `app/`: Main application source code (Nuxt 4 structure).
    -   `components/`: Reusable Vue components.
    -   `layouts/`: Application layouts (`default`, `admin`, `auth`, `page`).
    -   `pages/`: File-based routing.
    -   `assets/`: Static assets and global CSS (`main.css`).
-   `server/`: Server-side logic, API routes, and DB integration.
-   `prisma/`: Database schema and migrations.
-   `public/`: Public static files.

## 📝 License

[Private / Proprietary]
