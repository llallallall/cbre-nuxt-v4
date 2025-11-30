# **Nuxt 4 마이그레이션 및 UI/UX 개선 통합 가이드**

이 문서는 기존 Nuxt 3 프로젝트를 **Nuxt 4 구조로 전환**하고, **Nuxt UI**, **CBRE 디자인 시스템**, **Drizzle ORM** 등을 적용하여 시스템을 현대화하기 위한 통합 가이드라인입니다.

## **1\. 프로젝트 구조 (Project Structure)**

Nuxt 4의 표준 디렉토리 구조인 **app/** 패턴을 엄격히 준수합니다.

### **A. 소스 코드 (app/ 디렉토리)**

모든 애플리케이션 로직과 UI는 app/ 하위에 위치합니다.

* app/pages/  
* app/components/  
* app/layouts/  
* app/assets/css/ (전역 및 레이아웃 CSS)  
* app/composables/  
* app/middleware/  
* app/plugins/  
* app/app.vue  
* app/error.vue

### **B. 설정 및 정적 파일 (프로젝트 루트)**

설정 파일과 정적 리소스, 다국어 파일은 \*\*루트(Root)\*\*에 위치합니다.

* nuxt.config.ts  
* tailwind.config.ts  
* app.config.ts  
* server/ (API 및 DB 로직)  
* public/ (폰트, 이미지 등 정적 파일)  
  * public/fonts/  
  * public/images/  
* locales/ (i18n 언어 파일 \- **중요: app/ 내부가 아님**)

## **2\. 디자인 시스템 (Design System)**

CBRE 브랜드 아이덴티티(Green, Squared)를 유지하기 위한 규칙입니다.

### **A. 컬러 및 스타일**

* **Primary Color:** cbre-green (\#003F2D)  
* **Border Radius:** **rounded-none** (모든 UI 요소에 직각 모서리 적용)  
* **설정 관리:** app.config.ts에서 Nuxt UI 컴포넌트의 기본값을 재정의하여 자동 적용합니다.

// app.config.ts  
export default defineAppConfig({  
  ui: {  
    primary: 'cbre', // tailwind.config.ts에 정의된 cbre 컬러  
    gray: 'cool',  
    button: { rounded: 'rounded-none', default: { variant: 'solid' } },  
    input: { rounded: 'rounded-none' },  
    card: { rounded: 'rounded-none' },  
    modal: { rounded: 'rounded-none' },  
    notifications: { position: 'top-right' }  
  }  
})

### **B. 타이포그래피 (Fonts)**

public/fonts/에 위치한 로컬 폰트를 사용합니다.

* **기본 (Sans):** Calibre (Class: font-sans) \- 본문, 제목 기본  
* **강조 (Serif):** Financier (Class: font-serif) \- 인사이트, 리포트 등 강조  
* **데이터:** Barlow Condensed (Class: font-condensed) \- 숫자, 라벨

## **3\. UI 컴포넌트 리팩토링 (Nuxt UI)**

기존 Headless UI 및 커스텀 컴포넌트를 \*\*Nuxt UI (@nuxt/ui)\*\*로 교체합니다.

### **모달 (Modal)**

* **Legacy:** TransitionRoot \+ Dialog 복합 사용  
* **New:** \<UModal\> \+ \<UCard\> 사용

\<UModal v-model="isOpen"\>  
  \<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }"\>  
    \<template \#header\>\<h3 class="font-bold text-cbre-green"\>Title\</h3\>\</template\>  
    \<p\>Content\</p\>  
    \<template \#footer\>\<UButton @click="isOpen \= false"\>Close\</UButton\>\</template\>  
  \</UCard\>  
\</UModal\>

### **알림 (Toast)**

* **New:** useToast() 훅 사용. (Vuex/Pinia 불필요)

const toast \= useToast()  
toast.add({ title: 'Success', color: 'primary', icon: 'i-heroicons-check-circle' })

### **PDF 뷰어 (신규 기능)**

* **Component:** app/components/PdfViewer.vue (vue-pdf-embed 래퍼)  
* **Usage:** 반드시 **Lazy** 접두사를 붙여 사용 (성능 최적화)

\<LazyPdfViewer v-if="isOpen" :src="pdfUrl" /\>

## **4\. 레이아웃 및 스타일 관리**

* **CSS 분리:** 레이아웃(layouts/\*.vue)의 긴 \<style\> 코드는 app/assets/css/layouts/로 분리하고 @import 합니다.  
* **이미지:** public/images/ 경로를 사용하거나 \<NuxtImg\>로 최적화합니다.

\<\!-- app/layouts/admin-layout.vue \--\>  
\<style scoped\>  
@import '\~/assets/css/layouts/admin.css';  
\</style\>  
