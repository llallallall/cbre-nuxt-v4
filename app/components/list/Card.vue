<template>
        <div id="container" :class="containerClasses" class="w-full h-full overflow-y-auto pr-1">

                <div v-if="totalCount > 0"
                        class="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2 border-b mb-4 flex justify-between items-center">
                        <div class="text-sm">
                                <span class="font-bold text-lg pl-3">{{ totalCount }}</span> Properties found
                        </div>

                        <div class="flex items-center gap-2">
                                <div class="flex border border-gray-300 rounded-lg overflow-hidden h-[32px]">
                                        <button @click="uiStore.isGridView = false"
                                                class="px-3 flex items-center justify-center transition-colors"
                                                :class="!uiStore.isGridView ? 'bg-gray-100 text-cbre-green' : 'bg-white text-gray-400 hover:bg-gray-50'">
                                                <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
                                        </button>
                                        <div class="w-[1px] bg-gray-300"></div>
                                        <button @click="uiStore.isGridView = true"
                                                class="px-3 flex items-center justify-center transition-colors"
                                                :class="uiStore.isGridView ? 'bg-gray-100 text-cbre-green' : 'bg-white text-gray-400 hover:bg-gray-50'">
                                                <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5" />
                                        </button>
                                </div>

                                <button @click="uiStore.isExpandedList = !uiStore.isExpandedList"
                                        class="h-[32px] px-3 border border-gray-300 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-50">
                                        <UIcon :name="uiStore.isExpandedList ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
                                                class="w-4 h-4" />
                                        {{ uiStore.isExpandedList ? 'Shrink List' : 'Expand List' }}
                                </button>
                        </div>
                </div>

                <div v-if="itemsToDisplay.length > 0" class="relative pb-10"
                        :class="uiStore.isGridView ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-4'">

                        <template v-for="(item, index) in itemsToDisplay" :key="item.id">
                                <ListItem :item="item" :idx="totalCount - index" />
                        </template>

                        <div v-if="isLoadingMore" class="col-span-full flex justify-center py-4">
                                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-cbre-green" />
                        </div>

                        <div ref="loadMoreTrigger" class="h-4 w-full -mt-10 pointer-events-none opacity-0"></div>

                </div>

                <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
                        <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 mb-2 opacity-50" />
                        <p>No properties found.</p>
                </div>

        </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import type { PropertyType } from '~/types/property.type';
import ListItem from './Item.vue';

const props = defineProps({
        data: { type: Array as () => PropertyType[], default: () => [] },
        totalCount: { type: Number, default: 0 },
        itemsPerRender: { type: Number, default: 10 },
        containerClasses: { type: String, default: '' },
});

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { filteredProperties } = storeToRefs(propertyStore);

const itemsToDisplay = ref<PropertyType[]>([]);
const page = ref(1);
const isLoadingMore = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const resetList = () => {
        page.value = 1;
        itemsToDisplay.value = props.data.slice(0, props.itemsPerRender);

        if (loadMoreTrigger.value) {
                setupObserver();
        }
};

const loadMore = () => {
        if (itemsToDisplay.value.length >= props.data.length || isLoadingMore.value) return;

        isLoadingMore.value = true;

        setTimeout(() => {
                const nextBatch = props.data.slice(
                        itemsToDisplay.value.length,
                        itemsToDisplay.value.length + props.itemsPerRender
                );
                itemsToDisplay.value = [...itemsToDisplay.value, ...nextBatch];
                isLoadingMore.value = false;
        }, 300);
};

const setupObserver = () => {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver((entries) => {
                if (entries[0] && entries[0].isIntersecting) {
                        loadMore();
                }
        }, {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
        });

        if (loadMoreTrigger.value) {
                observer.observe(loadMoreTrigger.value);
        }
};

watch(() => props.data, () => {
        resetList();
}, { immediate: true });

onMounted(() => {
        setupObserver();
});

onUnmounted(() => {
        if (observer) observer.disconnect();
});
</script>
