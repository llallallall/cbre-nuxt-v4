# 📄 Nuxt 4 PDF 뷰어 구현 가이드 (vue-pdf-embed 활용)

이 문서는 Nuxt 4 및 Nuxt UI 환경에서 PDF 파일을 미리보기 위한 `vue-pdf-embed` 모듈의 설치, 설정 및 최적화된 사용 방법을 설명합니다.

## 1. 개요

* **목표:** 사용자가 PDF 파일을 다운로드하기 전에 웹 화면에서 내용을 미리 볼 수 있도록(Preview) 구현합니다.
* **방식:** `vue-pdf-embed` (PDF.js 래퍼)를 사용하여 `<canvas>`에 PDF를 렌더링합니다. `iframe` 방식보다 모바일 호환성과 커스터마이징이 뛰어납니다.
* **성능 최적화:** `Lazy Loading` (지연 로딩) 컴포넌트를 사용하여, 실제로 PDF를 볼 때만 무거운 라이브러리를 로드하도록 설정합니다.

---

## 2. 설치 (Installation)

터미널에서 다음 패키지를 설치합니다.

\`\`\`bash
npm install vue-pdf-embed
\`\`\`

---

## 3. 컴포넌트 생성 (Component Setup)

재사용 가능한 PDF 뷰어 컴포넌트를 만듭니다. 이 컴포넌트는 로딩 상태, 에러 처리, 스타일링을 포함합니다.
**경로:** `app/components/PdfViewer.vue`

\`\`\`vue
<template>
  <div class="pdf-viewer-container w-full flex justify-center bg-gray-100 p-4 rounded-none">
    <client-only>
      <!-- 로딩 상태 표시 -->
      <div v-if="loading" class="flex flex-col justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-cbre-green mb-2" />
        <span class="text-sm text-gray-600">Loading PDF document...</span>
      </div>
      
      <!-- PDF 렌더러 -->
      <vue-pdf-embed 
        v-if="src"
        :source="src" 
        :page="page"
        @rendered="handleRendered"
        @loading-failed="handleError"
        class="shadow-md border border-gray-200 bg-white transition-opacity duration-300"
        :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
      />
      
      <!-- 에러 표시 -->
      <div v-else-if="!src && !loading" class="flex justify-center items-center h-64 text-red-500">
        <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6 mr-2" />
        PDF Source is missing.
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  page: {
    type: Number,
    default: undefined // undefined면 전체 페이지 스크롤 모드
  }
})

const loading = ref(true)

const handleRendered = () => {
  loading.value = false
  console.log('✅ PDF Rendered Successfully')
}

const handleError = (error: any) => {
  loading.value = false
  console.error('❌ PDF Load Error:', error)
}

// 소스가 변경되면 로딩 상태 초기화
watch(() => props.src, () => {
  loading.value = true
})
</script>

<style scoped>
.pdf-viewer-container {
  min-height: 400px;
  max-height: 80vh;
  overflow-y: auto;
  /* 스크롤바 스타일링 (옵션) */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>
\`\`\`

---

## 4. 실제 사용 방법 (Usage & Optimization)

PDF 뷰어는 무겁기 때문에, `app.vue`나 레이아웃에 미리 포함하지 않고 **필요한 페이지에서만 동적으로 로드**하는 것이 성능상 유리합니다.

**핵심 포인트:** 컴포넌트 이름 앞에 **`Lazy`**를 붙여서 사용하세요. (`LazyPdfViewer`)

**예시 코드 (`pages/property/[id].vue` 등)**

\`\`\`vue
<template>
  <div>
    <!-- 1. 버튼 -->
    <UButton 
      icon="i-heroicons-document-text"
      label="브로셔 보기" 
      @click="openPdf('https://example.com/brochure.pdf')" 
    />

    <!-- 2. 모달 (Lazy Load 적용) -->
    <UModal v-model="isOpen" :ui="{ width: 'w-full sm:max-w-5xl' }">
      <UCard :ui="{ rounded: 'rounded-none', ring: '', divide: 'divide-y divide-gray-100' }">
        
        <!-- 헤더 -->
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-cbre-dark">Property Brochure</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isOpen = false" />
          </div>
        </template>

        <!-- [핵심] v-if로 모달이 열릴 때만 컴포넌트 로드 (Lazy + Code Splitting) -->
        <!-- 이렇게 하면 버튼을 누르기 전에는 PDF 라이브러리를 다운로드하지 않습니다. -->
        <LazyPdfViewer v-if="isOpen" :src="pdfUrl" />

        <!-- 푸터 -->
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="isOpen = false">닫기</UButton>
            <UButton color="primary" icon="i-heroicons-arrow-down-tray" @click="downloadPdf">다운로드</UButton>
          </div>
        </template>

      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const pdfUrl = ref('')

const openPdf = (url: string) => {
  pdfUrl.value = url
  isOpen.value = true
}

const downloadPdf = () => {
  if (pdfUrl.value) {
    window.open(pdfUrl.value, '_blank')
  }
}
</script>
\`\`\`

---

## 5. 주의사항 및 트러블슈팅

1.  **CORS 이슈 (중요):**
    * PDF 파일이 저장된 서버(MinIO, S3 등)에서 현재 도메인(`http://localhost:3000` 또는 `https://cbre.devowls.kr`)에 대한 **CORS(Cross-Origin Resource Sharing)** 설정이 허용되어 있어야 합니다.
    * 그렇지 않으면 브라우저 보안 정책으로 인해 PDF를 불러올 수 없습니다.

2.  **성능 관리:**
    * `app.vue`나 `layouts/default.vue` 등 전역적으로 로드되는 곳에 `<PdfViewer />`를 직접 import 하지 마세요. 초기 로딩 속도(LCP)에 악영향을 줍니다.
    * 반드시 **`<LazyPdfViewer />`** 형태로 사용하세요.

3.  **모바일 호환성:**
    * `vue-pdf-embed`는 모바일 브라우저의 터치 스크롤을 기본적으로 지원합니다. `iframe` 방식보다 훨씬 부드러운 사용자 경험을 제공합니다.