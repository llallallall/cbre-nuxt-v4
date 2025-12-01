<template>
        <NuxtLayout name="page-layout">
                <ClientOnly>
                        <div class="fixed w-full h-[calc(100%-80px)]">
                                <div v-if="pending" class="w-full h-full flex flex-col justify-center items-center">
                                        <div class="w-[100px] h-[30px] bg-gray-100 mb-1"></div>
                                        <div class="w-[60px] h-[30px] bg-gray-100"></div>
                                </div>

                                <div v-else class="w-full h-full relative transform transition-all overflow-y-scroll">

                                        <Head>
                                                <Title>{{ item?.name || 'Property Detail' }}</Title>
                                                <Meta name="description" :content="item?.name || 'Property Detail'" />
                                        </Head>

                                        <div ref="detailCardPrintAreaRef" class="relative w-full bg-white p-6 m-0 ">

                                                <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6
                                text-cbre-green">
                                                        {{ item?.name || 'Property Detail' }}
                                                </div>

                                                <div class="mt-6 flex gap-5 relative flex-col lg:flex-row">

                                                        <div class="w-full lg:w-1/2 flex flex-col">
                                                                <PropertyDetailActionSlide :location="item?.location"
                                                                        :images="item?.propertyImageFile"
                                                                        :brochure="item?.propertyBrochureFile" />
                                                        </div>
                                                        <div class="w-full lg:w-1/2 h-full flex flex-col justify-start">
                                                                <div
                                                                        class="remarks -mt-2 border-b border-gray-200 pb-2">
                                                                        <PropertyDetailGeneral
                                                                                :profitability="item?.profitability"
                                                                                :scale="item?.scale"
                                                                                :sector="item?.sector"
                                                                                :subsector="item?.subsector"
                                                                                :warehouse="item?.warehouse" />
                                                                </div>
                                                                <div
                                                                        class="highlights mt-4 border-0 border-gray-200 pb-0">
                                                                        <PropertyDetailHistoryList
                                                                                :history="item?.history" />
                                                                </div>
                                                        </div>
                                                </div>

                                                <div class="relative mt-4 border-b border-gray-200 pb-5" />

                                                <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                                        <PropertyDetailSizesAndMeasurements :scale="item?.scale" />
                                                </div>

                                                <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                                        <PropertyDetailFacility :facility="item?.facility" />
                                                </div>

                                                <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                                        <PropertyDetailParking :facility="item?.facility" />
                                                </div>

                                                <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                                        <PropertyDetailFloorPlanPhotos
                                                                :floorPlanFile="item?.floorPlanFile" />
                                                </div>

                                                <div class="relative mt-4 border-b border-gray-200 pb-10">
                                                        <PropertyDetailFloorsUsage :info="item?.floor" />
                                                </div>

                                                <div v-if="hasSales"
                                                        class="relative mt-4 border-b border-gray-200 pb-10">
                                                        <PropertyDetailSales :transaction="item?.transaction" />
                                                </div>

                                                <div v-if="hasLeaseActual"
                                                        class="relative mt-4 border-b border-gray-200 pb-10">
                                                        <PropertyDetailLeaseActual :transaction="item?.transaction" />
                                                </div>

                                                <div v-if="hasLeaseAsking"
                                                        class="relative mt-4 border-b border-gray-200 pb-10">
                                                        <PropertyDetailLeaseAsking :transaction="item?.transaction" />
                                                </div>

                                                <div class="relative mt-4 border-0 border-gray-200">
                                                        <PropertyDetailLocation :location="item?.location" />
                                                </div>

                                        </div>
                                </div>
                        </div>
                </ClientOnly>
        </NuxtLayout>
</template>

<script setup lang="ts">
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { storeToRefs } from 'pinia';

definePageMeta({
        middleware: "auth",
        layout: 'page-layout',
});

const route = useRoute();
const propertyStore = usePropertyStore();
const { currentProperty: item } = storeToRefs(propertyStore);
const uiStore = useUiStore();

const { data: propertyData, pending } = await useAsyncData(`property-detail-${route.params.id}`, async () => {
        if (route.params.id) {
                await propertyStore.fetchPropertyDetail(route.params.id as string);
                return propertyStore.currentProperty;
        }
        return null;
}, {
        watch: [() => route.params.id]
});

watch(propertyData, (newVal) => {
        if (newVal) {
                propertyStore.currentProperty = newVal;
        }
}, { immediate: true });

const hasSales = computed(() => {
        if (!item.value?.transaction) return false;
        return item.value.transaction.some(t => t.type === 'SALE');
});

const hasLeaseActual = computed(() => {
        if (!item.value?.transaction) return false;
        return item.value.transaction.some(t => t.type === 'LEASE' && t.lease?.leaseType === 'ACTUAL');
});

const hasLeaseAsking = computed(() => {
        if (!item.value?.transaction) return false;
        return item.value.transaction.some(t => t.type === 'LEASE' && t.lease?.leaseType === 'ASKING');
});

</script>
