<template>
        <div class="group w-full h-full relative select-none border border-gray-200 bg-white"
                :class="isKept ? 'bg-cbre-green-50' : ''">

                <div class="flex flex-col w-full h-full">

                        <!-- Image Section -->
                        <div class="cbre-image-wrapper relative w-full aspect-[4/3] bg-gray-100 overflow-hidden"
                                @click="openDetail">
                                <NuxtImg :src="currentImage" class="cbre-image" loading="lazy" alt="Property Image"
                                        @error="handleImageError" />

                                <!-- Hover Overlay: Info -->
                                <div
                                        class="absolute inset-0 bg-gray-100/95 p-6 flex flex-col justify-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-20 border-l-4 border-accent">
                                        <ListItemInfo :item="item" />
                                        <div
                                                class="mt-4 flex items-center text-cbre-green font-bold cursor-pointer hover:underline">
                                                Learn More
                                                <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
                                        </div>
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
                                        <div class="flex items-center text-[2rem] font-financier font-normal px-4 py-1">
                                                {{ item?.sector?.name }}
                                        </div>
                                        <div v-if="item.subsector"
                                                class="flex items-center h-[1.6rem] text-[1.6rem] font-calibre font-light pl-4 py-1 border-l border-gray-300/50">
                                                {{ item?.subsector?.name }}
                                        </div>
                                </div>
                        </div>

                        <!-- Content Section -->
                        <div class="flex flex-col p-4 gap-2 border-t border-gray-100">


                                <!-- Name -->
                                <div class="font-bold text-[2rem] leading-tight text-cbre-green-900 cursor-pointer hover:text-cbre-green-600 transition-colors"
                                        @click="openDetail" :title="item.name">
                                        {{ item.name }}
                                </div>

                                <!-- Address -->
                                <div class="flex text-2xl w-full text-cbre-green-900 font-normal truncate">
                                        <div v-if="item.location?.addressFull">{{ item.location.addressFull }}</div>
                                </div>
                                <div class="flex text-lg w-full text-gray-500 truncate">
                                        <div
                                                v-if="item.location?.addressCity && item.location?.addressCity !== '[NULL]'">
                                                {{ item.location.addressCity }}</div>
                                        <div
                                                v-if="item.location?.addressCity && item.location?.addressCity !== '[NULL]' && item.location?.addressProvince">
                                                ,&nbsp;
                                        </div>
                                        <div v-if="item.location?.addressProvince">{{ item.location.addressProvince
                                        }}</div>
                                </div>

                                <!--Transaction -->
                                <div class="flex text-lg w-full text-gray-500 truncate">
                                        <div v-if="item.transaction[0]?.type" class="cbre-button-primary">{{
                                                item.transaction[0].type }}</div>
                                        <div v-if="item.transaction[0]?.year" class="cbre-button-secondary">{{
                                                item.transaction[0].year }}</div>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import { useFormat } from '~/composables/useFormat';
import type { PropertyType } from '~/types/property.type';
import ListItemInfo from './ItemInfo.vue';

const props = defineProps<{
        item: PropertyType;
        idx: number;
}>();

const router = useRouter();
const mapStore = useMapStore();
const propertyStore = usePropertyStore();
const { getThumbnailUrl } = useFormat();

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
</script>
