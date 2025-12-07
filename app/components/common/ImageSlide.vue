<template>
        <div class="image-slide w-full h-[500px] select-none relative group">
                <img ref="slide" :src="currentDisplayImage"
                        class="object-cover w-full h-full max-h-[500px] relative transition-opacity duration-300"
                        @error="handleImageError" />

                <div class="small-previews w-full h-[100px] flex justify-center items-end gap-3 z-10 absolute bottom-2">
                        <div v-for="(preview, index) in images" :key="index"
                                class="preview overflow-hidden w-[50px] h-[50px] border-white/25 border-4 shadow-xl hover:scale-125 transition-all cursor-pointer"
                                @click="setImageSrc(preview?.remoteFileUrl || preview?.fileUrl || '')">
                                <img :src="preview?.remoteFileUrl || preview?.fileUrl || ''"
                                        class="object-cover w-full h-full border-white/25 border-2" />
                        </div>
                </div>

                <div class="expand-icon absolute top-0 right-0 p-2 text-cbre-green hover:text-white backdrop-blur-sm bg-white/25 hover:bg-cbre-green/75 cursor-pointer transition-colors"
                        @click="openFullscreen">
                        <UIcon name="i-heroicons-arrows-pointing-out" class="w-6 h-6" />
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStatusStore } from '~/stores/status';

const props = defineProps({
        images: {
                required: true,
                type: Array as () => any[]
        }
});

const statusStore = useStatusStore();
const slide = ref<HTMLImageElement | null>(null);
const currentSrc = ref('');

const currentDisplayImage = computed(() => {
        if (currentSrc.value) return currentSrc.value;
        if (props.images && props.images.length > 0) {
                const lastImg = props.images[props.images.length - 1];
                return lastImg?.remoteFileUrl || lastImg?.fileUrl || '/images/placeholder.jpg';
        }
        return '/images/placeholder.jpg';
});

const setImageSrc = (src: string) => {
        currentSrc.value = src;
};

const handleImageError = (e: Event) => {
        const target = e.target as HTMLImageElement;
        target.src = '/images/placeholder.jpg';
};

const openFullscreen = () => {
        statusStore.openViewerModal(currentDisplayImage.value, 'image');
};

watch(() => props.images, () => {
        currentSrc.value = '';
}, { deep: true });
</script>

<style scoped>
.preview {
        display: inline-block;
        width: 80px;
        height: 60px;
        margin: 4px;
}
</style>
