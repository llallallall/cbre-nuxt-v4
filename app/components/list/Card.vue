<template>
        <div id="container" :class="containerClasses" class="w-full h-full overflow-y-auto pr-1">

                <div v-if="totalCount > 0"
                        class="sticky top-0 z-30 bg-white/95 backdrop-blur-sm py-2 border-b mb-4 flex justify-between items-center">
                        <div class="text-xl flex items-center">
                                <span class="font-bold text-2xl px-2">{{ totalCount }}</span> {{ $t('properties_found')
                                }}
                                <UButton icon="i-heroicons-arrow-path" size="xl" color="neutral" variant="ghost"
                                        class="group ml-2 bg-transparent hover:bg-transparent"
                                        :ui="{ leadingIcon: 'group-hover:animate-spin' }"
                                        @click="propertyStore.fetchInitialData(true)" />
                        </div>

                        <div class="flex items-center gap-2 mr-2">
                                <UButton icon="i-heroicons-list-bullet" size="xl"
                                        class="rounded-none border-1 border-gray-300"
                                        :color="!uiStore.isGridView ? 'primary' : 'neutral'"
                                        :variant="!uiStore.isGridView ? 'soft' : 'ghost'"
                                        @click="uiStore.isGridView = false" />
                                <UButton icon="i-heroicons-squares-2x2" size="xl"
                                        class="rounded-none border-1 border-gray-300"
                                        :color="uiStore.isGridView ? 'primary' : 'neutral'"
                                        :variant="uiStore.isGridView ? 'soft' : 'ghost'"
                                        @click="uiStore.isGridView = true" />
                                <UButton :icon="uiStore.isExpandedList ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
                                        :label="uiStore.isExpandedList ? $t('shrink_list') : $t('expand_list')"
                                        size="lg" color="neutral" variant="outline"
                                        class="text-xl hidden lg:flex rounded-none"
                                        @click="uiStore.isExpandedList = !uiStore.isExpandedList" />
                        </div>
                </div>

                <div v-if="itemsToDisplay.length > 0" class="relative pb-10"
                        :class="uiStore.isGridView ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4' : 'flex flex-col gap-4'">

                        <template v-for="(item, index) in itemsToDisplay" :key="item.id">
                                <ListItem :item="item" :idx="totalCount - index" />
                        </template>

                        <div v-if="hasMoreItems && !isLoadingMore" class="col-span-full flex justify-center py-6">
                                <UButton :label="$t('list.load_more')" color="neutral" variant="outline" size="lg"
                                        class="px-8 shadow-sm border-gray-200 border text-gray-700 bg-white hover:bg-gray-50"
                                        @click="loadMore" />
                        </div>

                        <div v-if="isLoadingMore" class="col-span-full flex justify-center py-4">
                                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-cbre-green" />
                        </div>

                        <div ref="loadMoreTrigger" class="h-4 w-full -mt-10 pointer-events-none opacity-0"></div>

                        <div v-if="!hasMoreItems && totalCount > 0"
                                class="col-span-full text-center py-8 text-gray-400 text-sm font-medium">
                                {{ $t('list.all_loaded') }}
                        </div>

                </div>

                <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
                        <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 mb-2 opacity-50" />
                        <p>{{ $t('no_properties_found') }}</p>
                </div>

        </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useUiStore } from '~/stores/ui';
import { usePropertyStore } from '~/stores/property';
import type { PropertyType } from '~/types/property.type';
import ListItem from './Item.vue';

const props = defineProps({
        data: { type: Array as () => PropertyType[], default: () => [] },
        totalCount: { type: Number, default: 0 },
        itemsPerRender: { type: Number, default: 40 },
        containerClasses: { type: String, default: '' },
});

const uiStore = useUiStore();
const propertyStore = usePropertyStore();

const itemsToDisplay = ref<PropertyType[]>([]);
const page = ref(1);
const isLoadingMore = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const hasMoreItems = computed(() => itemsToDisplay.value.length < props.data.length);

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
