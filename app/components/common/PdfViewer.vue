<template>
    <div class="pdf-viewer-container w-full flex justify-center bg-gray-100 p-4 rounded-none">
        <client-only>
            <div v-if="loading" class="flex justify-center items-center h-64">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-cbre-green" />
                <span class="ml-2 text-gray-600">Loading PDF...</span>
            </div>

            <vue-pdf-embed v-if="src" :source="src" :page="page" @rendered="handleRendered"
                @loading-failed="handleError" class="shadow-md border border-gray-200" />

            <div v-else class="flex justify-center items-center h-64 text-red-500">
                PDF source not provided.
            </div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'

// PDF.js 워커 설정 (필수: 성능 향상 및 렌더링 오류 방지)
// 최신 버전에서는 자동으로 처리되기도 하지만, 명시적으로 설정하는 것이 안전합니다.
// import 'vue-pdf-embed/dist/style/index.css' (필요시)

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    page: {
        type: Number,
        default: undefined // undefined면 모든 페이지 렌더링 (스크롤 방식)
    }
})

const loading = ref(true)

const handleRendered = () => {
    loading.value = false
    console.log('PDF Rendered')
}

const handleError = (error: any) => {
    loading.value = false
    console.error('PDF Load Error:', error)
    // 여기서 토스트 메시지를 띄울 수 있습니다.
}
</script>

<style scoped>
/* PDF 뷰어 컨테이너 스타일링 */
.pdf-viewer-container {
    min-height: 300px;
    overflow-y: auto;
    max-height: 80vh;
    /* 모달 내부에서 스크롤되도록 */
}
</style>