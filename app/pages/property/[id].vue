<template>
    <NuxtLayout name="page-layout">

            <!-- Loading State -->
            <div v-if="pending" class="w-full h-screen flex flex-col justify-center items-center">
                <div class="w-[100px] h-[30px] bg-gray-100 mb-1 animate-pulse"></div>
                <div class="w-[60px] h-[30px] bg-gray-100 animate-pulse"></div>
            </div>

            <!-- Main Content -->
            <div v-else class="min-h-screen bg-white font-calibre pb-20">

                <Head>
                    <Title>{{ item?.name || 'Property Detail' }}</Title>
                    <Meta name="description" :content="item?.name || 'Property Detail'" />
                </Head>

                <!-- Hero Section (Full Width Background) -->
                <div class="w-full bg-cbre-green text-white shadow-md">
                    <div class="w-full p-0 flex flex-col justify-between lg:flex-row items-end">
                        <!-- Left Content -->
                        <div class="flex-1 py-12 px-6 lg:pl-10 lg:pr-12 flex flex-col justify-end border-l-8 border-accent">
                            <!-- Major Information -->
                            <span class="text-cbre-accent font-medium uppercase tracking-wider mb-2 text-sm">{{ item?.sector?.name || $t('property.detail.summary.sector') }}</span>
                            <span v-if="item?.subsector" class="text-cbre-accent font-medium uppercase tracking-wider mb-2 text-xs border-l-2 border-white/10 pl-2">{{ item?.subsector?.name || $t('property.detail.summary.subsector') }}</span>
                            <h1 class="cbre-text-display-hero text-white mb-6 leading-tight">
                                {{ item?.name || $t('property.detail.summary.title') }}
                            </h1>
                            <p class="cbre-text-body-lg text-gray-200 font-normal mb-8 " v-if="item?.location?.addressFull">
                                {{ item.location.addressFull }}
                            </p>
                            <!-- Statistics: Property Scale -->
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 mb-6 pt-6">
                                <div class="flex flex-col border-l-2 border-accent pl-4">
                                    <div class="flex items-end gap-1">
                                        <CommonAnimatedCount :target="effectiveRatio" :decimals="1" class="text-3xl lg:text-4xl font-serif text-white" />
                                        <span class="text-xl lg:text-2xl font-serif text-white mb-1">%</span>
                                    </div>
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('property.detail.summary.effective_ratio') }}</span>
                                </div>
                                <div class="flex flex-col border-l-2 border-accent pl-4">
                                    <CommonAnimatedCount :target="gfa" class="text-3xl lg:text-4xl font-serif text-white" />
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('property.detail.sizes.gfa') }} (㎡)</span>
                                </div>
                                <div class="flex flex-col border-l-2 border-accent pl-4">
                                    <CommonAnimatedCount :target="landArea" class="text-3xl lg:text-4xl font-serif text-white" />
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('property.detail.sizes.land_area') }} (㎡)</span>
                                </div>
                            </div>
                            
                            <!-- Statistics: Activity -->
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mb-10 border-t border-white/10 pt-6">
                                <div class="flex flex-col border-l-2 border-accent pl-4">
                                    <CommonAnimatedCount :target="saleCount" class="text-2xl lg:text-3xl font-serif text-white" />
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('sales') }}</span>
                                </div>
                                <div class="flex flex-col border-l-0">
                                    <CommonAnimatedCount :target="leaseCount" class="text-2xl lg:text-3xl font-serif text-white " />
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('leases') }}</span>
                                </div>
                                <div class="flex flex-col border-l-2 border-accent pl-4">
                                    <CommonAnimatedCount :target="buildingCount" class="text-2xl lg:text-3xl font-serif text-white" />
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('property.detail.summary.no_of_buildings') }}</span>
                                </div>
                                <div class="flex flex-col border-l-0">
                                    <CommonAnimatedCount :target="floorCount" class="text-2xl lg:text-3xl font-serif text-white " />
                                    <span class="text-xs uppercase tracking-wider text-cbre-accent font-medium mt-1">{{ $t('property.detail.floors.usage_title').split(' ')[0] }}</span>
                                </div>
                               
                            </div>

                            <!-- Date and Read Time -->
                            <div class="flex items-center text-xs font-medium uppercase tracking-wider text-gray-400 mb-8" v-if="item?.createdAt">
                                <span>{{ new Date(item.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                                <span class="mx-3 text-gray-600">/</span>
                                <span>{{ $t('property.detail.updated') }} {{ new Date(item.updatedAt || item.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                            </div>
                            
                            <!-- Action Buttons -->
                             <div class="flex flex-wrap gap-4 mt-auto">
                                <button @click="handleDownloadPdf" class="px-6 py-3 bg-white text-cbre-green font-bold uppercase text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                                     <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                                     {{ $t('download_pdf') }}
                                </button>
                                <button :disabled="!hasBrochure" @click="handleViewBrochure" class="px-6 py-3 border border-white text-white font-bold uppercase text-sm hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                    <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
                                    {{ $t('brochure') }}
                                </button>
                            </div>
                        </div>

                        <!-- Right Image -->
                        <div class="flex w-full lg:w-1/2 border-0 py-0">
                             <CommonImageSlide 
                                :images="validImages"
                                class="h-full max-h-[60rem] border-none rounded-none aspect-3/4"
                            />
                        </div>
                    </div>
                </div>

                <div class="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12">

                    <div class="flex gap-16 relative">
                        <!-- Left Sticky Nav (Report Style) -->
                        <div class="hidden xl:block w-72 flex-shrink-0">
                             <PropertyDetailAnchorNav 
                                :sections="sections" 
                                :has-brochure="hasBrochure"
                                @download-pdf="handleDownloadPdf" 
                                @view-brochure="handleViewBrochure"
                            />
                        </div>

                        <!-- Right Content Stream -->
                        <div class="flex-1 min-w-0 space-y-24">
                            
                            <!-- Overview Section -->
                            <section id="overview" class="scroll-mt-40">

                                
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div class="space-y-6">

                                        <PropertyDetailGeneral
                                            :profitability="item?.profitability"
                                            :scale="item?.scale"
                                            :sector="item?.sector"
                                            :subsector="item?.subsector"
                                            :warehouse="item?.warehouse" 
                                        />
                                    </div>
                                    <div class="space-y-6">

                                         <PropertyDetailHistoryList :history="item?.history" />
                                    </div>
                                </div>
                            </section>

                            <!-- Sizes -->
                            <section id="sizes" class="scroll-mt-40 border-t border-gray-100 pt-16">

                                <PropertyDetailSizesAndMeasurements :scale="item?.scale" />
                            </section>

                            <!-- Facility -->
                             <section id="facility" class="scroll-mt-40 border-t border-gray-100 pt-16">

                                <PropertyDetailFacility :facility="item?.facility" />
                            </section>

                             <!-- Parking -->
                             <section id="parking" class="scroll-mt-40 border-t border-gray-100 pt-16">

                                <PropertyDetailParking :facility="item?.facility" />
                            </section>

                            <!-- Floor Plans -->
                            <section id="floorplans" class="scroll-mt-40 border-t border-gray-100 pt-16">

                                <PropertyDetailFloorPlanPhotos :floorPlanFile="item?.floorPlanFile" />
                            </section>

                            <!-- Floors Usage -->
                            <section id="floors" class="scroll-mt-40 border-t border-gray-100 pt-16">

                                <PropertyDetailFloorsUsage :info="item?.floor" />
                            </section>

                            <!-- Transactions -->
                            <section v-if="hasTransactions" id="transactions" class="scroll-mt-40 border-t border-gray-100 pt-16">
                                <h3 class="cbre-text-display-2 mb-8">{{ $t('nav.anchor.transactions') }}</h3>
                                <div class="space-y-12">
                                    <PropertyDetailSales v-if="hasSales" :transaction="item?.transaction" />
                                    <PropertyDetailLeaseActual v-if="hasLeaseActual" :transaction="item?.transaction" />
                                    <PropertyDetailLeaseAsking v-if="hasLeaseAsking" :transaction="item?.transaction" />
                                </div>
                            </section>

                            <!-- Location -->
                            <section id="location" class="scroll-mt-40 border-t border-gray-100 pt-16 pb-20">

                                <PropertyDetailLocation :location="item?.location" />
                            </section>

                        </div>
                    </div>
                </div>
            </div>

        <!-- <BrochureList v-model="isBrochureModalOpen" :brochures="item?.propertyBrochureFile || []" /> -->
    </NuxtLayout>
</template>

<script setup lang="ts">
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useStatusStore } from '~/stores/status';
import { useAppToast } from '~/composables/useAppToast';
import { storeToRefs } from 'pinia';

definePageMeta({
    middleware: "auth",
    layout: 'page-layout',
    key: (route) => route.fullPath
});

const route = useRoute();
const propertyStore = usePropertyStore();
const { currentProperty: item } = storeToRefs(propertyStore);
const uiStore = useUiStore();
const { locale } = useI18n();

const { data: propertyData, pending } = await useAsyncData(`property-detail-${route.params.id}`, async () => {
    if (route.params.id) {
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        if (!id) return null;
        
        await propertyStore.fetchPropertyDetail(id);
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



// --- Transaction Checks ---
const hasSales = computed(() => item.value?.transaction?.some(t => t.type === 'SALE'));
const hasLeaseActual = computed(() => item.value?.transaction?.some(t => t.type === 'LEASE' && t.lease?.leaseType === 'ACTUAL'));
const hasLeaseAsking = computed(() => item.value?.transaction?.some(t => t.type === 'LEASE' && t.lease?.leaseType === 'ASKING'));
const hasTransactions = computed(() => hasSales.value || hasLeaseActual.value || hasLeaseAsking.value);

// --- Anchor Navigation Data ---
const sections = computed(() => {
    const list = [
        { id: 'overview', labelKey: 'nav.anchor.overview' },
        { id: 'sizes', labelKey: 'nav.anchor.sizes' },
        { id: 'facility', labelKey: 'nav.anchor.facility' },
        { id: 'parking', labelKey: 'nav.anchor.parking' },
        { id: 'floorplans', labelKey: 'nav.anchor.floorplans' },
        { id: 'floors', labelKey: 'nav.anchor.floors' },
    ];

    if (hasTransactions.value) {
        list.push({ id: 'transactions', labelKey: 'nav.anchor.transactions' });
    }

    list.push({ id: 'location', labelKey: 'nav.anchor.location' });
    
    return list;
});

// --- Statistics Counts ---
const saleCount = computed(() => item.value?.transaction?.filter(t => t.type === 'SALE').length || 0);
const leaseCount = computed(() => item.value?.transaction?.filter(t => t.type === 'LEASE').length || 0);
const floorCount = computed(() => item.value?.floor?.length || 0);
const buildingCount = computed(() => item.value?.scale?.noOfBuildings || 0);
const effectiveRatio = computed(() => item.value?.profitability?.effectiveRatio || 0);
const gfa = computed(() => item.value?.scale?.gfaSqm || 0);
const landArea = computed(() => item.value?.scale?.siteAreaSqm || 0);

// --- Image Logic ---
const validImages = computed(() => {
    const images = item.value?.propertyImageFile;
    const realImages = images ? images.filter((el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0) : [];
    
    if (realImages.length > 0) {
        return realImages;
    }

    // Fallback to sample images
    return [
        { fileUrl: '/images/background/bg-1.jpg' },
        { fileUrl: '/images/background/bg-2.jpg' },
        { fileUrl: '/images/background/bg-3.jpg' },
        { fileUrl: '/images/background/bg-4.jpg' }
    ];
});

// --- Brochure Logic (Migrated from ActionSlide) ---
const statusStore = useStatusStore();
const { showToast } = useAppToast();
const isBrochureModalOpen = ref(false);

const hasBrochure = computed(() => {
    return item.value?.propertyBrochureFile && item.value.propertyBrochureFile.length > 0;
});

const handleViewBrochure = () => {
    const brochures = item.value?.propertyBrochureFile || [];

    if (brochures.length === 0) {
        showToast('No brochure file registered', 'danger');
        return;
    }

    if (brochures.length === 1) {
        const brochureFile = brochures[0];
        const pdfUrl = brochureFile?.fileUrl;
        if (pdfUrl) {
            statusStore.openViewerModal(pdfUrl, 'pdf');
        } else {
            showToast('Invalid file URL', 'danger');
        }
        return;
    }

    // Multiple files
    isBrochureModalOpen.value = true;
};

// --- PDF Download Placeholder ---
const handleDownloadPdf = () => {
    alert("PDF Download feature is coming soon!");
    // Logic: Use window.print() or generate PDF via library
    // window.print();
}
</script>
