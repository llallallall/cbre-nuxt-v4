<template>
    <div class="image-slide w-full h-full relative group select-none bg-gray-900 overflow-hidden" @click="openFullscreen">
        <!-- Main Image -->
        <NuxtImg 
            :src="currentDisplayImage"
            format="webp"
            class="object-cover w-full h-full transition-all duration-700 cursor-pointer hover:scale-105"
            @error="handleImageError" 
        />
            
        <!-- Expand Button -->
        <div v-if="isValidImage" class="absolute top-4 right-4 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                @click.stop="openFullscreen">
                <UIcon name="i-heroicons-arrows-pointing-out" class="w-5 h-5" />
        </div>

        <!-- Controls Overlay (Bottom) -->
        <div v-if="hasMultipleImages" class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between gap-4 transition-all duration-300 ">
            
            <!-- Thumbnails (Left) -->
            <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-[70%]">
                <div v-for="(img, index) in images" :key="index"
                        class="relative shrink-0 w-[60px] h-[45px] cursor-pointer rounded-sm overflow-hidden border transition-all"
                        :class="currentIndex === index ? 'border-cbre-green ring-1 ring-cbre-green opacity-100 scale-105' : 'border-white/30 opacity-60 hover:opacity-100'"
                        @click.stop="setIndex(index)">
                    <NuxtImg :src="img?.remoteFileUrl || img?.fileUrl || ''"
                            width="60" height="45" format="webp" fit="cover"
                            class="object-cover w-full h-full" />
                </div>
            </div>

            <!-- Auto Slide Switch (Right) -->
             <button @click.stop="toggleAutoSlide" class="flex items-center gap-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 transition-colors backdrop-blur-sm shadow-sm whitespace-nowrap mb-1">
                <div class="w-2 h-2 rounded-full transition-colors duration-300" :class="isAutoSlide ? 'bg-cbre-green animate-pulse shadow-[0_0_8px_rgba(0,128,0,0.8)]' : 'bg-gray-400'"></div>
                {{ isAutoSlide ? 'Auto On' : 'Auto Off' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStatusStore } from '~/stores/status';

const props = defineProps({
    images: {
        required: true,
        type: Array as () => any[]
    }
});

const statusStore = useStatusStore();
const currentIndex = ref(0);
const isAutoSlide = ref(true);
let slideInterval: NodeJS.Timeout | null = null;

const hasMultipleImages = computed(() => props.images && props.images.length > 1);

const currentDisplayImage = computed(() => {
    if (!props.images || props.images.length === 0) return '/images/placeholder.jpg';
    const img = props.images[currentIndex.value];
    return img?.remoteFileUrl || img?.fileUrl || '/images/placeholder.jpg';
});

const isValidImage = computed(() => {
    return !currentDisplayImage.value.includes('placeholder');
});

const setIndex = (index: number) => {
    currentIndex.value = index;
    // Reset timer on manual interaction
    if (isAutoSlide.value) {
        startAutoSlide();
    }
};

const nextSlide = () => {
    if (!hasMultipleImages.value) return;
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const startAutoSlide = () => {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3500);
};

const stopAutoSlide = () => {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = null;
};

const toggleAutoSlide = () => {
    isAutoSlide.value = !isAutoSlide.value;
    if (isAutoSlide.value) {
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
};

const handleImageError = (e: Event | string) => {
    if (typeof e === 'string') return;
    const target = e.target as HTMLImageElement;
    if (target) {
        target.src = '/images/placeholder.jpg';
    }
};

const openFullscreen = () => {
    statusStore.openViewerModal(currentDisplayImage.value, 'image');
};

// Lifecycle
onMounted(() => {
    if (hasMultipleImages.value && isAutoSlide.value) {
        startAutoSlide();
    }
});

onUnmounted(() => {
    stopAutoSlide();
});

watch(() => props.images, () => {
    currentIndex.value = 0;
    if (hasMultipleImages.value && isAutoSlide.value) {
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
}, { deep: true });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>
