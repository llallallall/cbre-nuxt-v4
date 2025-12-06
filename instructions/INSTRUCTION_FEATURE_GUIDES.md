# 🧩 Specific Feature Implementation Guides

This document contains detailed implementation strategies for specific features in the project.

---

## 1. Address Strategy (Kakao Local API & Public Data)

### Overview
> [!NOTE]
> **UNDER CONSIDERATION**: This strategy is currently under review for future implementation. It is not yet finalized.

A 3-step strategy to cleanse user address input, acquire coordinates, and get the official Engish address.

### Step 1: Cleansing & Search (Kakao)
- **API**: Kakao Local API (Address Search).
- **Process**:
  1. Input user query (Korean/English).
  2. If ambiguous, show candidate list.
  3. User selects one -> Extract **Korean Road Name** and **Coordinates (X, Y)**.

### Step 2: Coordinate Acquisition
- **Source**: Coordinates are already acquired in Step 1 (Kakao API response).
- **Action**: Save specific Lat/Lng for map rendering.

### Step 3: English Address Conversion (Ministry of Interior)
- **API**: Public Data Portal (Road Name Address API).
- **Process**:
  1. Send Korean Road Name from Step 1.
  2. Receive Official English Road Name.
  3. Fallback: If only Jibun address exists, use Romanization logic.

### Summary Data Flow
| Data | Source |
| :--- | :--- |
| **Clean Address (KR)** | Kakao API (User Selection) |
| **Coordinates (X/Y)** | Kakao API |
| **Official English** | Public Data Portal API |

---

## 2. PDF Viewer (`vue-pdf-embed`)

### Overview
Preview PDF files using `vue-pdf-embed` (PDF.js wrapper) rendered on `<canvas>`.
**Component**: `<LazyPdfViewer />` (Must be lazy loaded).

### Installation
```bash
npm install vue-pdf-embed
```

### Component Structure (`app/components/PdfViewer.vue`)
- **Features**: Loading spinner, Error handling, `v-if` rendering.
- **Props**: `src` (String, required), `page` (Number, optional).

### Usage (Best Practices)
1. **Dynamic Loading**:
   Always use `<LazyPdfViewer v-if="isOpen" />` inside Modals or hidden panels. This prevents loading the heavy PDF library until the user actually requests it.
2. **CORS Handling**:
   Ensure S3/MinIO buckets have CORS configured to allow GET requests from `localhost:3000` and production domains.
3. **Download**:
   Provide a separate "Download" button that opens the raw PDF URL (`window.open(url)`).
