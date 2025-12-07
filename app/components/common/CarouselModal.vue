<template>
    <UModal :model-value="isOpen" @update:model-value="setIsOpen" fullscreen>
        <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4" @click="closeModal">
            <!-- Close Button (Absolute Top-Right) -->
            <div class="absolute top-6 right-6 z-[100000]">
                <UButton icon="i-heroicons-x-mark" variant="ghost" color="primary" size="xl"
                    class="rounded-full text-accent hover:bg-white/20 transition-colors" @click.stop="closeModal" />
            </div>

            <!-- Content Container -->
            <div
                class="bg-transparent w-full max-w-7xl h-full flex flex-col items-center justify-center relative pointer-events-none">
                <!-- Inner Modal for Carousel (Pointer events auto to allow interaction) -->
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden pointer-events-auto flex flex-col"
                    @click.stop>
                    <!-- Carousel Section -->
                    <div class="relative bg-gray-100 dark:bg-gray-900 aspect-video flex items-center justify-center">
                        <div v-if="items.length === 0" class="text-gray-400 flex flex-col items-center">
                            <UIcon name="i-heroicons-photo" class="w-16 h-16 mb-2 opacity-50" />
                            <span>No images available</span>
                        </div>

                        <UCarousel v-else ref="carousel" v-slot="{ item }" arrows :items="items"
                            :prev-button="{ color: 'white', icon: 'i-heroicons-arrow-left-20-solid', class: '!bg-black/50 hover:!bg-black/70 right-auto left-4' }"
                            :next-button="{ color: 'white', icon: 'i-heroicons-arrow-right-20-solid', class: '!bg-black/50 hover:!bg-black/70 left-auto right-4' }"
                            class="w-full h-full" :ui="{ item: 'basis-full h-full justify-center' }" @select="onSelect">
                            <img :src="item" class="w-full h-full object-contain" draggable="false">
                        </UCarousel>
                    </div>

                    <!-- Thumbs Section -->
                    <div v-if="items.length > 1" class="p-4 bg-white border-t border-gray-100 overflow-x-auto">
                        <div class="flex gap-3 justify-center min-w-min mx-auto">
                            <button v-for="(item, index) in items" :key="index" type="button"
                                class="relative size-16 md:size-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none"
                                :class="activeIndex === index ? 'ring-2 ring-cbre-green-500 ring-offset-2 opacity-100' : 'opacity-60 hover:opacity-100'"
                                @click="select(index)">
                                <img :src="item" class="w-full h-full object-cover">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStatusStore } from '~/stores/status'

const statusStore = useStatusStore()

// Computed for v-model binding
const isOpen = computed(() => statusStore.isSlideOpen)

const setIsOpen = (value: boolean) => {
    if (!value) closeModal()
}

const closeModal = () => {
    statusStore.closeSlideModal()
}

// Data Processing
const items = computed(() => {
    // Filter valid images and map to simple array of strings
    return (statusStore.slideImages || [])
        .map((img: any) => img.remoteFileUrl || img.fileUrl)
        .filter(url => !!url)
});

// Carousel Logic
const carousel = ref()
const activeIndex = ref(0)

// Reset index when modal opens
watch(isOpen, (newVal) => {
    if (newVal) {
        activeIndex.value = 0
        // Wait for next tick to ensure carousel is rendered before scrolling (if needed)
        setTimeout(() => {
            if (carousel.value && carousel.value.emblaApi) {
                carousel.value.emblaApi.scrollTo(0)
            }
        }, 100)
    }
})

function onSelect(index: number) {
    activeIndex.value = index
}

function select(index: number) {
    activeIndex.value = index
    if (carousel.value && carousel.value.emblaApi) {
        carousel.value.emblaApi.scrollTo(index)
    }
}
</script>
