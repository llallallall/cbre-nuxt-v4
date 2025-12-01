<template>
    <div class="pdf-viewer-container w-full h-full overflow-auto flex flex-col items-center bg-gray-100 p-4">
        <div v-if="loading" class="flex items-center justify-center h-full">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-cbre-green" />
        </div>

        <div v-if="error" class="flex items-center justify-center h-full text-red-500">
            Failed to load PDF.
        </div>

        <VuePdfEmbed v-if="source" :source="source" class="shadow-lg" @loaded="onLoaded" @loading-failed="onError" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const props = defineProps<{
    source: string
}>()

const loading = ref(true)
const error = ref(false)

const onLoaded = () => {
    loading.value = false
}

const onError = () => {
    loading.value = false
    error.value = true
}
</script>

<style scoped>
.pdf-viewer-container {
    /* Custom scrollbar if needed */
}
</style>