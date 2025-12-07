<template>
    <div class="w-screen h-screen overflow-hidden">
        <div ref="wrapperElement" class="relative flex w-full h-full flex-col lg:flex-row">

            <div :class="[
                'overflow-hidden transition-all duration-300',
                'w-full lg:w-auto lg:h-[calc(100vh-80px)]',
                uiStore.isHiddenList ? 'h-full lg:w-full' : 'h-[50%] lg:flex-1'
            ]">
                <UButton v-if="uiStore.isHiddenList" icon="i-ph-sidebar-simple" label="Show List" color="neutral"
                    variant="outline"
                    class="absolute z-10 bg-white hover:bg-gray-50 transition-all duration-300 animate-fade-in bottom-[20px] right-[20px] top-auto lg:top-[90px] lg:right-[80px] lg:bottom-auto shadow-md border-gray-300 rounded-md"
                    @click="uiStore.isHiddenList = false" />
                <ClientOnly>
                    <MapContainer />
                </ClientOnly>
            </div>

            <div v-show="!uiStore.isHiddenList" :class="[
                'transition-all duration-300 border-gray-200',
                'w-full h-[50%] border-t lg:h-[calc(100vh-80px)] lg:border-l lg:border-t-0',
                uiStore.isExpandedList ? 'lg:w-[50%]' : 'lg:w-[40%] lg:min-w-[400px] lg:max-w-[600px]'
            ]">
                <ListCard :data="filteredProperties" :totalCount="filteredProperties.length" :itemsPerRender="6"
                    containerClasses="bg-cbre-green-50 p-2 pt-0 h-full" defaultLoadingColor="#222" />
            </div>

            <CommonFabMenu :wrapper-element="wrapperElement" />

            <div v-if="uiStore.isFabOpen || uiStore.showInfoModal" @click="closeFabMenu"
                class="fixed inset-0 top-0 bg-black/25 backdrop-blur-sm transition-opacity"
                :class="uiStore.isFabOpen ? 'block z-[60]' : 'hidden z-0'">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';

definePageMeta({
    layout: 'default'
});

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { filteredProperties } = storeToRefs(propertyStore);
const wrapperElement = ref<HTMLElement | null>(null);

onMounted(async () => {
    await propertyStore.fetchInitialData();
});

const closeFabMenu = () => {
    uiStore.isFabOpen = false;
    uiStore.showInfoModal = false;
};
</script>

<style scoped></style>
