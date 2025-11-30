# **🎨 CBRE Design System & UI Guidelines (Nuxt 4)**

본 문서는 CBRE 공식 웹사이트(cbre.com)의 브랜드 아이덴티티를 Nuxt 4 프로젝트에 일관되게 적용하기 위한 디자인 지침입니다. pre-optimized-min.css 분석을 바탕으로 작성되었습니다.

## **1. 🎨 Color System (색상 시스템)**

CBRE의 색상은 신뢰감을 주는 **Forest Green**을 주조색으로 하며, 명확한 위계질서를 가집니다.

### **A. Primary Colors (주조색)**

브랜드의 핵심 색상입니다.

* **CBRE Green (Brand Color):** #003F2D (var(--eds-color-primary-1)) - 로고, 헤더, 주요 버튼, 텍스트 강조
* **Bright Green (Accent):** #17E88F (var(--eds-color-primary-2)) - 호버 효과, 활성 상태 표시, 그래프 강조
* **Dark Green (Background):** #012A2D (var(--eds-color-primary-3)) - 어두운 섹션 배경, 푸터 배경
* **Slate Grey (Text):** #435254 (var(--eds-color-primary-4)) - 본문 텍스트 기본색

### **B. Secondary & Utility Colors (보조색)**

* **Secondary Blue:** #032842 (var(--eds-color-secondary-1))
* **Light Grey (Background):** #F5F7F7 (var(--color-system-15)) - 섹션 배경, 카드 배경
* **Border Grey:** #CAD1D3 (var(--eds-color-primary-5)) - 테두리, 구분선

### **💻 Tailwind CSS Config 적용 예시**

tailwind.config.ts에 아래 설정을 적용하여 클래스명으로 사용하세요.

```typescript
theme: {
  extend: {
    colors: {
      cbre: {
        green: '#003F2D',
        accent: '#17E88F',
        dark: '#012A2D',
        slate: '#435254',
        bg: '#F5F7F7',
        border: '#CAD1D3'
      }
    }
  }
}
```

## **2. ✍️ Typography (타이포그래피)**

CBRE는 **Serif (제목)**와 **Sans-Serif (본문)**를 명확히 구분하여 사용합니다.

### **A. Font Families**

* **Financier Display (Serif):** 제목, 강조 구문 (H1, H2, H3) - *Elegant, Trustworthy*
* **Calibre (Sans-Serif):** 본문, UI 요소, 버튼, 라벨 - *Modern, Clean*
* **Barlow Condensed:** 숫자, 데이터 강조

### **B. Font Sizes & Line Heights**

* **Base Size:** 1.6rem (16px)
* **Line Height:** 1.6 (본문), 1.2 (제목)

## **3. 🧩 UI Components (컴포넌트)**

### **A. Buttons (버튼)**

CBRE 버튼은 **직각(Squared)** 형태이며, 둥근 모서리(Rounded)를 사용하지 않습니다. **모든 버튼은 Calibre (Sans-Serif) 폰트를 사용해야 합니다.**

* **Primary Button:**
  * 배경: #003F2D (Green)
  * 텍스트: White
  * 테두리: 1px solid #003F2D
  * Hover: 배경 #17E88F (Bright Green)

* **Secondary Button (Ghost):**
  * 배경: Transparent
  * 테두리: 2px solid #003F2D
  * 텍스트: #003F2D
  * Hover: 배경 #003F2D, 텍스트 White

### **B. Cards (카드)**

* **형태:** 직각 (Rounded-None)
* **테두리:** 없음 또는 1px Solid #CAD1D3 (상단에 굵은 Green Border 포인트 자주 사용)
* **Shadow:** 평소엔 없음, Hover 시 부드러운 shadow-lg
* **인터랙션:** 이미지 확대(Scale Up) 효과보다는 텍스트 밑줄 애니메이션 선호

### **C. Forms (입력 폼)**

* **Input Field:**
  * 배경: #F4F4F4 (연한 회색) 또는 White
  * 테두리: 하단에만 Border (Underline Style) 또는 전체 1px 직각 Border
  * Focus: #003F2D 색상으로 Border 변경

## **4. 📐 Layout & Spacing (레이아웃)**

### **A. Container**

* **Max Width:** 1440px (Desktop 기준)
* **Padding:** 좌우 24px (Mobile) / 56px (Desktop)
* 콘텐츠는 중앙 정렬이 원칙입니다.

### **B. Spacing (여백)**

CBRE 디자인은 여백(White Space)을 충분히 활용하여 고급스러움을 줍니다.

* **Section Gap:** 최소 80px ~ 120px
* **Component Gap:** 24px ~ 32px

## **5. 🛠 Nuxt UI Integration (Nuxt UI 통합)**

### **A. Modules**

다음 모듈들이 통합되어 있습니다:
*   `@nuxt/ui`: UI 컴포넌트 라이브러리
*   `@nuxt/icon`: 아이콘 시스템 (Iconify 기반)
*   `@nuxt/fonts`: 웹 폰트 최적화
*   `@nuxtjs/i18n`: 다국어 지원

### **B. Theming (테마 설정)**

CBRE 브랜드 컬러는 `app.config.ts`와 `nuxt.config.ts`를 통해 Nuxt UI 시스템에 통합되어 있습니다.

*   **Primary Color:** `cbre-green`으로 매핑되어 있습니다. `<UButton color="primary">` 사용 시 CBRE Green이 적용됩니다.
*   **Configuration:** `app.config.ts`에서 `ui.colors`를 통해 런타임 색상을 제어합니다.

```typescript
// app.config.ts
export default defineAppConfig({
    ui: {
        colors: {
            primary: 'cbre-green',
            gray: 'cool'
        }
    }
})
```

### **C. Icons (아이콘)**

`@nuxt/icon`을 사용하여 아이콘을 렌더링합니다. Heroicons 컬렉션이 로컬에 설치되어 있습니다.

*   **Usage:**
    ```vue
    <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
    <UButton icon="i-heroicons-arrow-right" />
    ```

### **D. Internationalization (i18n)**

다국어 지원을 위해 `app.vue`에서 `<UApp>`에 `locale`을 바인딩해야 합니다.

*   **Setup (app.vue):**
    ```vue
    <script setup>
    import * as locales from '@nuxt/ui/locale'
    const { locale } = useI18n()
    </script>

    <template>
        <UApp :locale="locales[locale]">
            <NuxtPage />
        </UApp>
    </template>
    ```

### **E. Component Best Practices (컴포넌트 사용 팁)**

**1. Modal (`UModal`)**
Nuxt UI v3에서는 `v-model:open`을 사용하며, 컨텐츠는 `#content` 슬롯에 래핑하는 것을 권장합니다.

```vue
<UModal v-model:open="isOpen">
    <template #content>
        <UCard>
            <template #header>Title</template>
            Body Content
            <template #footer>Footer</template>
        </UCard>
    </template>
</UModal>
```

**2. Toast (`useToast`)**
알림 메시지는 `useToast` 컴포저블을 사용합니다.

```typescript
const toast = useToast()

toast.add({
    title: 'Success',
    description: 'Action completed.',
    color: 'primary', // CBRE Green
    icon: 'i-heroicons-check-circle'
})
# **🎨 CBRE Design System & UI Guidelines (Nuxt 4)**

본 문서는 CBRE 공식 웹사이트(cbre.com)의 브랜드 아이덴티티를 Nuxt 4 프로젝트에 일관되게 적용하기 위한 디자인 지침입니다. pre-optimized-min.css 분석을 바탕으로 작성되었습니다.

## **1. 🎨 Color System (색상 시스템)**

CBRE의 색상은 신뢰감을 주는 **Forest Green**을 주조색으로 하며, 명확한 위계질서를 가집니다.

### **A. Primary Colors (주조색)**

브랜드의 핵심 색상입니다.

*   **CBRE Green (Brand Color):** #003F2D (var(--eds-color-primary-1)) - 로고, 헤더, 주요 버튼, 텍스트 강조
*   **Bright Green (Accent):** #17E88F (var(--eds-color-primary-2)) - 호버 효과, 활성 상태 표시, 그래프 강조
*   **Dark Green (Background)::** #012A2D (var(--eds-color-primary-3)) - 어두운 섹션 배경, 푸터 배경
*   **Slate Grey (Text):** #435254 (var(--eds-color-primary-4)) - 본문 텍스트 기본색

### **B. Secondary & Utility Colors (보조색)**

*   **Secondary Blue:** #032842 (var(--eds-color-secondary-1))
*   **Light Grey (Background):** #F5F7F7 (var(--color-system-15)) - 섹션 배경, 카드 배경
*   **Border Grey:** #CAD1D3 (var(--eds-color-primary-5)) - 테두리, 구분선

### **💻 Tailwind CSS Config 적용 예시**

tailwind.config.ts에 아래 설정을 적용하여 클래스명으로 사용하세요.

```typescript
theme: {
  extend: {
    colors: {
      cbre: {
        green: '#003F2D',
        accent: '#17E88F',
        dark: '#012A2D',
        slate: '#435254',
        bg: '#F5F7F7',
        border: '#CAD1D3'
      }
    }
  }
}
```

## **2. ✍️ Typography (타이포그래피)**

CBRE는 **Serif (제목)**와 **Sans-Serif (본문)**를 명확히 구분하여 사용합니다.

### **A. Font Families**

*   **Financier Display (Serif):** 제목, 강조 구문 (H1, H2, H3) - *Elegant, Trustworthy*
*   **Calibre (Sans-Serif):** 본문, UI 요소, 버튼, 라벨 - *Modern, Clean*
*   **Barlow Condensed:** 숫자, 데이터 강조

### **B. Font Sizes & Line Heights**

*   **Base Size:** 1.6rem (16px)
*   **Line Height:** 1.6 (본문), 1.2 (제목)

## **3. 🧩 UI Components (컴포넌트)**

### **A. Buttons (버튼)**

CBRE 버튼은 **직각(Squared)** 형태이며, 둥근 모서리(Rounded)를 사용하지 않습니다. **모든 버튼은 Calibre (Sans-Serif) 폰트를 사용해야 합니다.**

*   **Primary Button:**
    *   배경: #003F2D (Green)
    *   텍스트: White
    *   테두리: 1px solid #003F2D
    *   Hover: 배경 #17E88F (Bright Green)

*   **Secondary Button (Ghost):**
    *   배경: Transparent
    *   테두리: 2px solid #003F2D
    *   텍스트: #003F2D
    *   Hover: 배경 #003F2D, 텍스트 White

### **B. Cards (카드)**

*   **형태:** 직각 (Rounded-None)
*   **테두리:** 없음 또는 1px Solid #CAD1D3 (상단에 굵은 Green Border 포인트 자주 사용)
*   **Shadow:** 평소엔 없음, Hover 시 부드러운 shadow-lg
*   **인터랙션:** 이미지 확대(Scale Up) 효과보다는 텍스트 밑줄 애니메이션 선호

### **C. Forms (입력 폼)**

*   **Input Field:**
    *   배경: #F4F4F4 (연한 회색) 또는 White
    *   테두리: 하단에만 Border (Underline Style) 또는 전체 1px 직각 Border
    *   Focus: #003F2D 색상으로 Border 변경

## **4. 📐 Layout & Spacing (레이아웃)**

### **A. Container**

*   **Max Width:** 1440px (Desktop 기준)
*   **Padding:** 좌우 24px (Mobile) / 56px (Desktop)
*   콘텐츠는 중앙 정렬이 원칙입니다.

### **B. Spacing (여백)**

CBRE 디자인은 여백(White Space)을 충분히 활용하여 고급스러움을 줍니다.

*   **Section Gap:** 최소 80px ~ 120px
*   **Component Gap:** 24px ~ 32px

## **5. 🛠 Nuxt UI Integration (Nuxt UI 통합)**

### **A. Modules**

다음 모듈들이 통합되어 있습니다:
*   `@nuxt/ui`: UI 컴포넌트 라이브러리
*   `@nuxt/icon`: 아이콘 시스템 (Iconify 기반)
*   `@nuxt/fonts`: 웹 폰트 최적화
*   `@nuxtjs/i18n`: 다국어 지원

### **B. Theming (테마 설정)**

CBRE 브랜드 컬러는 `app.config.ts`와 `nuxt.config.ts`를 통해 Nuxt UI 시스템에 통합되어 있습니다.

*   **Primary Color:** `cbre-green`으로 매핑되어 있습니다. `<UButton color="primary">` 사용 시 CBRE Green이 적용됩니다.
*   **Configuration:** `app.config.ts`에서 `ui.colors`를 통해 런타임 색상을 제어합니다.

```typescript
// app.config.ts
export default defineAppConfig({
    ui: {
        colors: {
            primary: 'cbre-green',
            gray: 'cool'
        }
    }
})
```

### **C. Icons (아이콘)**

`@nuxt/icon`을 사용하여 아이콘을 렌더링합니다. Heroicons 컬렉션이 로컬에 설치되어 있습니다.

*   **Usage:**
    ```vue
    <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
    <UButton icon="i-heroicons-arrow-right" />
    ```

### **D. Internationalization (i18n)**

다국어 지원을 위해 `app.vue`에서 `<UApp>`에 `locale`을 바인딩해야 합니다.

*   **Setup (app.vue):**
    ```vue
    <script setup>
    import * as locales from '@nuxt/ui/locale'
    const { locale } = useI18n()
    </script>

    <template>
        <UApp :locale="locales[locale]">
            <NuxtPage />
        </UApp>
    </template>
    ```

### **E. Component Best Practices (컴포넌트 사용 팁)**

**1. Modal (`UModal`)**
Nuxt UI v3에서는 `v-model:open`을 사용하며, 컨텐츠는 `#content` 슬롯에 래핑하는 것을 권장합니다.

```vue
<UModal v-model:open="isOpen">
    <template #content>
        <UCard>
            <template #header>Title</template>
            Body Content
            <template #footer>Footer</template>
        </UCard>
    </template>
</UModal>
```

**2. Toast (`useToast`)**
알림 메시지는 `useToast` 컴포저블을 사용합니다.

```typescript
const toast = useToast()

toast.add({
    title: 'Success',
    description: 'Action completed.',
    color: 'primary', // CBRE Green
    icon: 'i-heroicons-check-circle'
})
```

### **6. Typography System [NEW]**

Use these utility classes to ensure consistency with CBRE's visual identity.

| Class Name | Font Family | Usage |
| :--- | :--- | :--- |
| `.cbre-text-hero` | **Financier** (Serif) | Massive headlines for hero sections (e.g., "We are the global leader..."). |
| `.cbre-text-h1` | **Financier** (Serif) | Page titles or major section headers (e.g., "Latest Insights"). |
| `.cbre-text-h2` | **Financier** (Serif) | Sub-section headers or card titles (e.g., "Global Life Sciences Atlas"). |
| `.cbre-text-h3` | **Financier** (Serif) | Smaller headings. |
브랜드의 핵심 색상입니다.

*   **CBRE Green (Brand Color):** #003F2D (var(--eds-color-primary-1)) - 로고, 헤더, 주요 버튼, 텍스트 강조
*   **Bright Green (Accent):** #17E88F (var(--eds-color-primary-2)) - 호버 효과, 활성 상태 표시, 그래프 강조
*   **Dark Green (Background)::** #012A2D (var(--eds-color-primary-3)) - 어두운 섹션 배경, 푸터 배경
*   **Slate Grey (Text):** #435254 (var(--eds-color-primary-4)) - 본문 텍스트 기본색

### **B. Secondary & Utility Colors (보조색)**

*   **Secondary Blue:** #032842 (var(--eds-color-secondary-1))
*   **Light Grey (Background):** #F5F7F7 (var(--color-system-15)) - 섹션 배경, 카드 배경
*   **Border Grey:** #CAD1D3 (var(--eds-color-primary-5)) - 테두리, 구분선

### **💻 Tailwind CSS Config 적용 예시**

tailwind.config.ts에 아래 설정을 적용하여 클래스명으로 사용하세요.

```typescript
theme: {
  extend: {
    colors: {
      cbre: {
        green: '#003F2D',
        accent: '#17E88F',
        dark: '#012A2D',
        slate: '#435254',
        bg: '#F5F7F7',
        border: '#CAD1D3'
      }
    }
  }
}
```

## **2. ✍️ Typography (타이포그래피)**

CBRE는 **Serif (제목)**와 **Sans-Serif (본문)**를 명확히 구분하여 사용합니다.

### **A. Font Families**

*   **Financier Display (Serif):** 제목, 강조 구문 (H1, H2, H3) - *Elegant, Trustworthy*
*   **Calibre (Sans-Serif):** 본문, UI 요소, 버튼, 라벨 - *Modern, Clean*
*   **Barlow Condensed:** 숫자, 데이터 강조
*   **Space Mono (Monospace):** 코드, 기술 데이터, 특정 메타데이터 - *Technical, Precise*

### **B. Font Sizes & Line Heights**

*   **Base Size:** 1.6rem (16px)
*   **Line Height:** 1.6 (본문), 1.2 (제목)

## **3. 🧩 UI Components (컴포넌트)**

### **A. Buttons (버튼)**

CBRE 버튼은 **직각(Squared)** 형태이며, 둥근 모서리(Rounded)를 사용하지 않습니다. **모든 버튼은 Calibre (Sans-Serif) 폰트를 사용해야 합니다.**

*   **Primary Button:**
    *   배경: #003F2D (Green)
    *   텍스트: White
    *   테두리: 1px solid #003F2D
    *   Hover: 배경 #17E88F (Bright Green)

*   **Secondary Button (Ghost):**
    *   배경: Transparent
    *   테두리: 2px solid #003F2D
    *   텍스트: #003F2D
    *   Hover: 배경 #003F2D, 텍스트 White

### **B. Cards (카드)**

*   **형태:** 직각 (Rounded-None)
*   **테두리:** 없음 또는 1px Solid #CAD1D3 (상단에 굵은 Green Border 포인트 자주 사용)
*   **Shadow:** 평소엔 없음, Hover 시 부드러운 shadow-lg
*   **인터랙션:** 이미지 확대(Scale Up) 효과보다는 텍스트 밑줄 애니메이션 선호

### **C. Forms (입력 폼)**

*   **Input Field:**
    *   배경: #F4F4F4 (연한 회색) 또는 White
    *   테두리: 하단에만 Border (Underline Style) 또는 전체 1px 직각 Border
    *   Focus: #003F2D 색상으로 Border 변경

## **4. 📐 Layout & Spacing (레이아웃)**

### **A. Container**

*   **Max Width:** 1440px (Desktop 기준)
*   **Padding:** 좌우 24px (Mobile) / 56px (Desktop)
*   콘텐츠는 중앙 정렬이 원칙입니다.

### **B. Spacing (여백)**

CBRE 디자인은 여백(White Space)을 충분히 활용하여 고급스러움을 줍니다.

*   **Section Gap:** 최소 80px ~ 120px
*   **Component Gap:** 24px ~ 32px

## **5. 🛠 Nuxt UI Integration (Nuxt UI 통합)**

### **A. Modules**

다음 모듈들이 통합되어 있습니다:
*   `@nuxt/ui`: UI 컴포넌트 라이브러리
*   `@nuxt/icon`: 아이콘 시스템 (Iconify 기반)
*   `@nuxt/fonts`: 웹 폰트 최적화
*   `@nuxtjs/i18n`: 다국어 지원

### **B. Theming (테마 설정)**

CBRE 브랜드 컬러는 `app.config.ts`와 `nuxt.config.ts`를 통해 Nuxt UI 시스템에 통합되어 있습니다.

*   **Primary Color:** `cbre-green`으로 매핑되어 있습니다. `<UButton color="primary">` 사용 시 CBRE Green이 적용됩니다.
*   **Configuration:** `app.config.ts`에서 `ui.colors`를 통해 런타임 색상을 제어합니다.

```typescript
// app.config.ts
export default defineAppConfig({
    ui: {
        colors: {
            primary: 'cbre-green',
            gray: 'cool'
        }
    }
})
```

### **C. Icons (아이콘)**

`@nuxt/icon`을 사용하여 아이콘을 렌더링합니다. Heroicons 컬렉션이 로컬에 설치되어 있습니다.

*   **Usage:**
    ```vue
    <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
    <UButton icon="i-heroicons-arrow-right" />
    ```

### **D. Internationalization (i18n)**

다국어 지원을 위해 `app.vue`에서 `<UApp>`에 `locale`을 바인딩해야 합니다.

*   **Setup (app.vue):**
    ```vue
    <script setup>
    import * as locales from '@nuxt/ui/locale'
    const { locale } = useI18n()
    </script>

    <template>
        <UApp :locale="locales[locale]">
            <NuxtPage />
        </UApp>
    </template>
    ```

### **E. Component Best Practices (컴포넌트 사용 팁)**

**1. Modal (`UModal`)**
Nuxt UI v3에서는 `v-model:open`을 사용하며, 컨텐츠는 `#content` 슬롯에 래핑하는 것을 권장합니다.

```vue
<UModal v-model:open="isOpen">
    <template #content>
        <UCard>
            <template #header>Title</template>
            Body Content
            <template #footer>Footer</template>
        </UCard>
    </template>
</UModal>
```

**2. Toast (`useToast`)**
알림 메시지는 `useToast` 컴포저블을 사용합니다.

```typescript
const toast = useToast()

toast.add({
    title: 'Success',
    description: 'Action completed.',
    color: 'primary', // CBRE Green
    icon: 'i-heroicons-check-circle'
})
```

### **6. Typography System [NEW]**

Use these utility classes to ensure consistency with CBRE's visual identity.

| Class Name | Font Family | Usage |
| :--- | :--- | :--- |
| `.cbre-text-hero` | **Financier** (Serif) | Massive headlines for hero sections (e.g., "We are the global leader..."). |
| `.cbre-text-h1` | **Financier** (Serif) | Page titles or major section headers (e.g., "Latest Insights"). |
| `.cbre-text-h2` | **Financier** (Serif) | Sub-section headers or card titles (e.g., "Global Life Sciences Atlas"). |
| `.cbre-text-h3` | **Financier** (Serif) | Smaller headings. |
| `.cbre-text-body-large` | **Financier** (Serif) | Intro text or lead paragraphs. |
| `.cbre-text-body` | **Financier** (Serif) | Standard body text. |
| `.cbre-text-label` | **Calibre** (Sans) | Uppercase, small text with wide tracking (e.g., "REPORT | INTELLIGENT INVESTMENT"). |
| `.cbre-text-meta` | **Calibre** (Sans) | Grey, small text for dates or categories. |

**General Rules:**
*   **Headings & Body:** **Serif (Financier)** is the primary typeface for content.
*   **Labels & UI:** **Sans-serif (Calibre)** is used for small labels, buttons, and metadata.
*   **Tracking:** Headings have tight tracking (`-0.01em` to `-0.02em`). Labels have wide tracking (`0.05em`).

### **7. Readability & Contrast [NEW]**

To ensure accessibility and legibility, follow these contrast guidelines:

*   **Avoid Light Grey on White:** Do not use light grey colors (e.g., `text-gray-400`) for essential text on white backgrounds. It fails accessibility standards.
*   **Use High Contrast:**
    *   **Headings:** Use `text-cbre-green` (`#003F2D`) or `.cbre-text-h*` classes.
    *   **Body Text:** Use `text-cbre-slate` (`#435254`) or `.cbre-text-body`.
    *   **Meta/Labels:** Use `text-gray-500` (`#666666`) only for non-critical metadata.
*   **Dark Backgrounds:** When using dark backgrounds (e.g., `bg-cbre-dark`), ensure text is White (`text-white`) or Bright Green (`text-cbre-accent`).