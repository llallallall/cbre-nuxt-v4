<template>
    <CommonModal :model-value="isOpen" @update:model-value="setIsOpen" max-width="max-w-5xl w-full" no-padding>
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
                <NuxtImg :src="item" class="w-full h-full object-contain" draggable="false" format="webp"
                    quality="80" />
            </UCarousel>
        </div>

        <!-- Thumbs Section -->
        <div v-if="items.length > 1" class="p-4 bg-white border-t border-gray-100 overflow-x-auto">
            <div class="flex gap-3 justify-center min-w-min mx-auto">
                <button v-for="(item, index) in items" :key="index" type="button"
                    class="relative size-16 md:size-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none"
                    :class="activeIndex === index ? 'ring-2 ring-cbre-green-500 ring-offset-2 opacity-100' : 'opacity-60 hover:opacity-100'"
                    @click="select(index)">
                    <NuxtImg :src="item" class="w-full h-full object-cover" width="80" format="webp" />
                </button>
            </div>
        </div>
    </CommonModal>
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
