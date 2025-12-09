<template>
        <div class="w-full h-full relative select-none border border-gray-200 bg-white"
                :class="isKept ? 'bg-cbre-green-50' : ''">

                <div v-if="uiStore.isGridView" class="flex flex-col w-full h-full aspect-[1/1]">

                        <!-- Image Section -->
                        <div
                                class="cbre-image-wrapper relative w-full aspect-[3/2] bg-gray-100 overflow-hidden shrink-0">
                                <NuxtImg :src="currentImage" class="cbre-image" loading="lazy" alt="Property Image"
                                        @error="handleImageError" @click.stop="openSlide" />

                                <!-- Hover Overlay: Info -->
                                <div class="absolute inset-0 bg-gray-100/95 p-6 flex flex-col justify-center transform transition-transform duration-300 ease-in-out z-20 border-l-4 border-accent truncate"
                                        :class="isHovered ? 'translate-x-0' : '-translate-x-full'">
                                        <ListItemInfo :item="item" />
                                </div>

                                <!-- Status Badges -->
                                <div class="absolute top-2 right-2 flex flex-col gap-2 z-10">
                                        <div @click.stop="moveToMap" title="Show on Map"
                                                class="flex justify-center items-center text-white hover:text-accent cursor-pointer transition-all">
                                                <UIcon name="i-heroicons-map-pin-solid" class="text-[20px] shadow-md" />
                                        </div>

                                        <div @click.stop="toggleKeep" title="Keep Property"
                                                class="flex justify-center items-center cursor-pointer transition-all"
                                                :class="isKept ? 'text-yellow-400' : 'text-white hover:text-yellow-400'">
                                                <UIcon name="i-heroicons-star-solid" class="shadow-md text-[20px]" />
                                        </div>
                                </div>

                                <!-- Sector / Subsector -->
                                <div class="absolute bottom-0 left-0 flex w-full justify-start items-center 
                                        bg-cbre-green-600
                                         text-white tracking-wider p-0 ">
                                        <div class="flex items-center font-financier font-normal"
                                                :class="!uiStore.isExpandedList ? 'text-[1.0rem] px-1.5 py-0.5' : 'text-[2rem] px-4 py-1'">
                                                {{ item?.sector?.name }}
                                        </div>
                                        <div v-if="item.subsector"
                                                class="flex items-center font-calibre font-light border-l border-gray-300/50"
                                                :class="!uiStore.isExpandedList ? 'text-[0.85rem] h-[1.1rem] pl-1.5 py-0.5' : 'text-[1.6rem] h-[1.6rem] pl-4 py-1'">
                                                {{ item?.subsector?.name }}
                                        </div>
                                </div>
                        </div>

                        <!-- Content Section -->
                        <div class="group flex flex-col gap-1 border-t border-gray-100 min-h-0 overflow-hidden"
                                :class="!uiStore.isExpandedList ? 'py-2 px-3 gap-1' : 'p-4 gap-2'"
                                @mouseenter="isHovered = true" @mouseleave="isHovered = false">

                                <!-- Name -->
                                <div ref="nameRef"
                                        class="cbre-text-link-fade-arrow font-semibold text-cbre-green-900 cursor-pointer hover:text-cbre-green-600 transition-colors whitespace-nowrap overflow-hidden"
                                        :class="!uiStore.isExpandedList ? 'text-[1.2rem] leading-normal mb-1' : 'text-[2rem] leading-normal'"
                                        @click="openDetail" :title="item.name">
                                        {{ item.name }}
                                </div>

                                <!-- Address -->
                                <div class="w-full text-cbre-green-900 font-normal break-keep"
                                        :class="!uiStore.isExpandedList ? 'text-xs leading-normal line-clamp-2' : 'flex text-2xl truncate leading-normal'">
                                        <div v-if="item.location?.addressFull">{{ item.location.addressFull }}</div>
                                </div>

                                <div class="w-full text-gray-500 hidden xl:flex"
                                        :class="!uiStore.isExpandedList ? 'text-[10px] leading-normal mt-0.5 truncate' : 'text-lg truncate leading-normal'">
                                        <span
                                                v-if="item.location?.addressCity && item.location?.addressCity !== '[NULL]'">
                                                {{ item.location.addressCity }}
                                        </span>
                                        <span
                                                v-if="item.location?.addressCity && item.location?.addressCity !== '[NULL]' && item.location?.addressProvince">,
                                        </span>
                                        <span v-if="item.location?.addressProvince">
                                                {{ item.location.addressProvince }}
                                        </span>
                                </div>

                                <!-- Transaction -->
                                <div class="flex w-full text-gray-500 truncate mt-auto pt-2"
                                        :class="!uiStore.isExpandedList ? 'text-[10px]' : 'text-lg'">
                                        <div v-if="item.transaction[0]?.type" class="cbre-button-primary"
                                                :class="!uiStore.isExpandedList ? 'px-1.5 py-0.5 text-[10px]' : ''">
                                                {{ item.transaction[0].type }}
                                        </div>
                                        <div v-if="item.transaction[0]?.year" class="cbre-button-secondary ml-1.5"
                                                :class="!uiStore.isExpandedList ? 'px-1.5 py-0.5 text-[10px]' : ''">
                                                {{ item.transaction[0].year }}
                                        </div>
                                </div>
                        </div>
                </div>
                <div v-else>
                        <div class="flex flex-row w-full h-full">
                                <!-- Image -->
                                <div class="cbre-image-wrapper relative bg-gray-100 overflow-hidden w-[120px] min-w-[120px] h-full shrink-0"
                                        @click="openDetail">
                                        <NuxtImg :src="currentImage" class="cbre-image cover w-full h-full"
                                                loading="lazy" alt="Property Image" @error="handleImageError" />
                                </div>
                                <!-- Status Badges -->
                                <div class="flex flex-col justify-center items-center gap-2 bg-cbre-green-500">
                                        <div @click.stop="moveToMap" title="Show on Map"
                                                class="flex justify-center items-center text-white hover:text-accent cursor-pointer transition-all">
                                                <UIcon name="i-heroicons-map-pin-solid" class="text-[20px] shadow-md" />
                                        </div>

                                        <div @click.stop="toggleKeep" title="Keep Property"
                                                class="flex justify-center items-center cursor-pointer transition-all"
                                                :class="isKept ? 'text-yellow-400' : 'text-white hover:text-yellow-400'">
                                                <UIcon name="i-heroicons-star-solid" class="shadow-md text-[20px]" />
                                        </div>
                                </div>
                                <div class="flex flex-row w-full gap-4 ml-4">
                                        <!-- Sector -->
                                        <div class="relative flex flex-col justify-center items-center 
                                                bg-cbre-green-600
                                                text-white tracking-wider p-0 ">
                                                <div
                                                        class="flex items-center text-[2rem] font-financier font-normal px-4 py-1">
                                                        {{ item?.sector?.name }}
                                                </div>
                                                <div v-if="item.subsector"
                                                        class="flex items-center h-[1.6rem] text-[1.6rem] font-calibre font-light pl-4 py-1">
                                                        {{ item?.subsector?.name }}
                                                </div>
                                        </div>
                                        <div class="flex flex-col w-full">
                                                <div class="flex flex-col w-full">
                                                        <!-- Name -->
                                                        <div class="flex flex-row justify-start w-full">
                                                                <div class="font-semibold text-[2rem] leading-tight text-cbre-green-900 cursor-pointer hover:text-cbre-green-600 transition-colors"
                                                                        @click="openDetail" :title="item.name">
                                                                        {{ item.name }}
                                                                </div>
                                                                <div v-if="item.transaction[0]?.type"
                                                                        class="cbre-button-primary">{{
                                                                                item.transaction[0].type }}</div>
                                                                <div v-if="item.transaction[0]?.year"
                                                                        class="cbre-button-secondary">{{
                                                                                item.transaction[0].year }}</div>
                                                        </div>
                                                        <!--  Address -->
                                                        <div class="flex flex-row justify-start w-full min-w-0">
                                                                <div class="flex text-lg text-gray-500 pr-4 shrink-0">
                                                                        <div
                                                                                v-if="item.location?.addressCity && item.location?.addressCity !== '[NULL]'">
                                                                                {{ item.location.addressCity }}</div>
                                                                        <div
                                                                                v-if="item.location?.addressCity && item.location?.addressCity !== '[NULL]' && item.location?.addressProvince">
                                                                                ,&nbsp;
                                                                        </div>
                                                                        <div v-if="item.location?.addressProvince">{{
                                                                                item.location.addressProvince
                                                                        }}</div>
                                                                </div>
                                                                <div ref="listAddressRef"
                                                                        class="flex-1 text-2xl w-full text-cbre-green-900 font-normal truncate border-l-1 border-gray-300 pl-2 whitespace-nowrap overflow-hidden">
                                                                        <div v-if="item.location?.addressFull">{{
                                                                                item.location.addressFull }}</div>
                                                                </div>
                                                        </div>

                                                </div>
                                                <!--  Additional info -->
                                                <ListItemInfo :item="item" />
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '~/stores/ui';
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import { useFormat } from '~/composables/useFormat';
import type { PropertyType } from '~/types/property.type';
import ListItemInfo from './ItemInfo.vue';

import { useAppToast } from '~/composables/useAppToast';

const props = defineProps<{
        item: PropertyType;
        idx: number;
}>();

const { showToast } = useAppToast();

const router = useRouter();
const uiStore = useUiStore();
const mapStore = useMapStore();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { getThumbnailUrl } = useFormat();

const isHovered = ref(false);



const openSlide = () => {
        if (props.item.propertyImageFile && props.item.propertyImageFile.length > 0) {
                statusStore.openSlideModal(props.item.propertyImageFile);
        } else {
                showToast('No Images', 'info', { description: 'This property has no images to display.' });
        }
};

const getInitialImage = () => {
        const mainImage = props.item.propertyImageFile?.find(img => img.main);
        const originalUrl = mainImage?.fileUrl;
        return getThumbnailUrl(originalUrl);
};

const currentImage = ref(getInitialImage());

watch(() => props.item, () => {
        currentImage.value = getInitialImage();
});

const handleImageError = () => {
        const mainImage = props.item.propertyImageFile?.find(img => img.main);
        const originalUrl = mainImage?.fileUrl;

        if (originalUrl && currentImage.value !== originalUrl) {
                currentImage.value = originalUrl;
                return;
        }

        if (currentImage.value !== '/images/placeholder.jpg') {
                currentImage.value = '/images/placeholder.jpg';
        }
};

const hasSale = computed(() => props.item.transaction?.some(t => t.type === 'SALE'));
const hasLease = computed(() => props.item.transaction?.some(t => t.type === 'LEASE'));

const isKept = computed(() => propertyStore.isKept(props.item.id));
const toggleKeep = () => {
        propertyStore.toggleKeep(props.item.id);
};

const openDetail = () => {
        const routeData = router.resolve({ path: `/property/${props.item.id}` });
        window.open(routeData.href, '_blank');
};

const moveToMap = () => {
        if (props.item.location?.latitude && props.item.location?.longitude) {
                mapStore.setPinCoordinate(props.item.location.longitude, props.item.location.latitude);
        }
};

const nameRef = ref<HTMLElement | null>(null);
const listAddressRef = ref<HTMLElement | null>(null);

const adjustTextSize = async () => {
        await nextTick();
        const elements = [nameRef.value, listAddressRef.value];

        elements.forEach(el => {
                if (!el) return;

                // Reset to measure natural width
                el.style.fontSize = '';

                // If overflowing
                if (el.scrollWidth > el.clientWidth) {
                        // Calculate ratio (Safe guard min size to 1.5rem to be readable)
                        const currentSize = 2; // base size in rem (This is an approximation, ideally we get computed style)
                        // But we can just use the scroll/client ratio to scale down whatever the current computed size is effectively

                        // However, the class binding changes font-size based on isExpandedList.
                        // So we should capture the 'intended' size from the class first?
                        // Actually, if we reset style.fontSize = '', the class takes over.
                        // So el.scrollWidth is based on the class-defined font size.
                        // We just need to scale it down.

                        const ratio = el.clientWidth / el.scrollWidth;
                        // Get current font size from computed style to apply exact ratio
                        const computedFontSize = parseFloat(window.getComputedStyle(el).fontSize);
                        // computedFontSize is in px.

                        // We want to apply scaling on top of the CSS class size.
                        // If we just set a fixed rem based on ratio, it overrides the class.

                        // Let's stick to the previous logic but maybe more dynamic
                        // If we assume the base is what CSS provides.
                        // newSizePx = computedFontSize * ratio

                        // Convert back to rem for consistency or just use px
                        const newSizePx = Math.max(computedFontSize * ratio, 12); // min 12px
                        el.style.fontSize = `${newSizePx}px`;
                }
        });
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
        // Initial check
        setTimeout(adjustTextSize, 100);

        // Setup ResizeObserver
        resizeObserver = new ResizeObserver(() => {
                adjustTextSize();
        });

        if (nameRef.value) resizeObserver.observe(nameRef.value);
        if (listAddressRef.value) resizeObserver.observe(listAddressRef.value);

        // Also watch parent container or window for layout shifts that might not directly trigger element resize immediately if they are purely flex based without container query
        // But observing the element itself is usually enough as its clientWidth changes.
});

// Watch item specifically for content changes
watch(() => props.item, adjustTextSize, { deep: true });

// Listen to UI store changes directly just in case transition delays affect observer
watch(() => uiStore.isExpandedList, () => {
        setTimeout(adjustTextSize, 300); // Wait for transition
});

</script>
