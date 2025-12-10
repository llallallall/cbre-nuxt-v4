<template>
        <UModal :model-value="show" @update:model-value="emit('close')" fullscreen
                :ui="{ content: 'bg-transparent', overlay: 'bg-black/50 backdrop-blur-sm z-[60]', wrapper: 'z-[70]' }">
                <div class="fixed inset-0 overflow-auto flex items-center justify-center p-0 md:p-4 mt-[80px]"
                        @click="emit('close')">
                        <div @click.stop
                                class="bg-white w-full h-full md:w-2/3 lg:w-3/5 xl:w-1/2 md:max-h-[85vh] rounded-none md:rounded-xl shadow-xl flex flex-col overflow-hidden relative">

                                <!-- Header -->
                                <div class="p-6 pb-0 flex justify-between items-start border-b border-gray-100 mb-2">
                                        <div class="flex flex-col gap-4 w-full">
                                                <div class="flex items-end justify-between w-full pb-4">
                                                        <h3 class="cbre-text-display-2 text-cbre-green">
                                                                {{ $t('map.selected_info.title') }}
                                                        </h3>

                                                        <div class="flex items-center gap-6 mr-12">
                                                                <!-- Download Excel -->
                                                                <UButton color="primary" variant="solid"
                                                                        icon="i-vscode-icons-file-type-excel2"
                                                                        class="cbre-button-brief-sm"
                                                                        @click="onDownloadExcel">
                                                                        {{ $t('map.selected_info.download_excel') }}
                                                                </UButton>

                                                                <div class="h-8 w-px bg-gray-200"></div>

                                                                <!-- No Transaction Filter -->
                                                                <div class="flex flex-col items-center gap-1">
                                                                        <span
                                                                                class="cbre-text-label-sm text-[10px] sm:text-[11px] font-bold text-gray-500">
                                                                                {{
                                                                                        $t('map.selected_info.filter.no_transaction')
                                                                                }}
                                                                        </span>
                                                                        <USwitch v-model="filterNoTransaction"
                                                                                color="primary" size="sm" />
                                                                </div>

                                                                <!-- Sales Filter -->
                                                                <div class="flex flex-col items-center gap-1">
                                                                        <span
                                                                                class="cbre-text-label-sm text-[10px] sm:text-[11px] font-bold text-gray-500">
                                                                                {{ $t('map.selected_info.filter.sales')
                                                                                }}
                                                                        </span>
                                                                        <USwitch v-model="filterSale" color="primary"
                                                                                size="sm" />
                                                                </div>

                                                                <!-- Leases Filter -->
                                                                <div class="flex flex-col items-center gap-1">
                                                                        <span
                                                                                class="cbre-text-label-sm text-[10px] sm:text-[11px] font-bold text-gray-500">
                                                                                {{ $t('map.selected_info.filter.leases')
                                                                                }}
                                                                        </span>
                                                                        <USwitch v-model="filterLease" color="primary"
                                                                                size="sm" />
                                                                </div>
                                                        </div>
                                                </div>
                                                <p class="cbre-text-body-md text-gray-500 mb-4">
                                                        {{ $t('map.selected_info.filter.desc') }}
                                                </p>
                                        </div>

                                        <UButton color="primary" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                                                class="absolute top-4 right-4 text-[20px]" @click="emit('close')" />
                                </div>

                                <!-- Content -->
                                <div class="p-6 overflow-y-auto bg-white flex-1">
                                        <div
                                                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6">
                                                <div v-for="(item, index) in filteredItems" :key="item.id"
                                                        class="border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4"
                                                        :class="isGeneralSelected(item.id) ? 'bg-white' : 'bg-gray-50 opacity-80'">

                                                        <div class="cbre-text-display-3 text-cbre-green pb-2 border-b border-gray-100 truncate"
                                                                :title="item.name">
                                                                {{ item.name }}
                                                        </div>

                                                        <div
                                                                class="grid grid-cols-3 gap-2 pb-2 border-b border-gray-100">
                                                                <div class="flex flex-col">
                                                                        <span
                                                                                class="cbre-text-label-sm text-gray-400 mb-1">{{
                                                                                        $t('map.selected_info.card.grade')
                                                                                }}</span>
                                                                        <span class="cbre-text-body-md font-medium">{{
                                                                                item.profitability?.grade || 'N/A'
                                                                        }}</span>
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <span
                                                                                class="cbre-text-label-sm text-gray-400 mb-1">{{
                                                                                        $t('map.selected_info.card.sector')
                                                                                }}</span>
                                                                        <span class="cbre-text-body-md font-medium">{{
                                                                                item.sector?.name || 'N/A' }}</span>
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <span
                                                                                class="cbre-text-label-sm text-gray-400 mb-1">{{
                                                                                        $t('map.selected_info.card.sub_sector')
                                                                                }}</span>
                                                                        <span class="cbre-text-body-md font-medium">{{
                                                                                item.subsector?.name || 'N/A' }}</span>
                                                                </div>
                                                        </div>

                                                        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                                                <div v-for="preview in item.propertyImageFile"
                                                                        :key="preview.id"
                                                                        class="w-[100px] h-[75px] min-w-[100px] border border-gray-200 rounded-sm overflow-hidden cursor-pointer hover:opacity-90">
                                                                        <NuxtImg :src="getThumbnailUrl(preview.fileUrl)"
                                                                                width="100" height="75" format="webp"
                                                                                loading="lazy"
                                                                                class="object-cover w-full h-full" />
                                                                </div>
                                                        </div>

                                                        <div class="flex-1 flex flex-col gap-4">
                                                                <!-- Sales -->
                                                                <div v-if="item.transaction && item.transaction.some(t => t.type === 'SALE')"
                                                                        class="flex flex-col gap-2">
                                                                        <h4
                                                                                class="cbre-text-label-sm text-cbre-green border-b border-gray-100 pb-1">
                                                                                {{
                                                                                        $t('map.selected_info.card.transaction_sales')
                                                                                }}</h4>
                                                                        <div class="flex flex-col gap-2">
                                                                                <div v-for="(el, idx) in item.transaction.filter(t => t.type === 'SALE')"
                                                                                        :key="idx"
                                                                                        class="flex items-center justify-between">
                                                                                        <span
                                                                                                class="cbre-text-body-md text-sm">{{
                                                                                                        idx + 1 }}. {{ el.year
                                                                                                }}/{{ el.quarter
                                                                                                }}</span>
                                                                                        <USwitch :model-value="isSaleSelected(item.id, idx)"
                                                                                                @update:model-value="toggleSale(item.id, idx)"
                                                                                                color="primary"
                                                                                                size="xs" />
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <!-- Leases -->
                                                                <div v-if="getLeases(item).length > 0"
                                                                        class="flex flex-col gap-2">
                                                                        <h4
                                                                                class="cbre-text-label-sm text-cbre-green border-b border-gray-100 pb-1">
                                                                                {{
                                                                                        $t('map.selected_info.card.transaction_leases')
                                                                                }}</h4>
                                                                        <div class="flex flex-col gap-2">
                                                                                <div v-for="(el, idx) in getLeases(item)"
                                                                                        :key="idx"
                                                                                        class="flex items-center justify-between">
                                                                                        <span
                                                                                                class="cbre-text-body-md text-sm">{{
                                                                                                        idx + 1 }}. {{
                                                                                                        formatDate(el.leaseStartDate)
                                                                                                }}</span>
                                                                                        <USwitch :model-value="isLeaseSelected(item.id, idx)"
                                                                                                @update:model-value="toggleLease(item.id, idx)"
                                                                                                color="primary"
                                                                                                size="xs" />
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div
                                                                class="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                                                                <div class="cbre-text-label-sm"
                                                                        :class="isGeneralSelected(item.id) ? 'text-teal-700' : 'text-gray-400'">
                                                                        {{ isGeneralSelected(item.id) ?
                                                                                $t('map.selected_info.card.status.included') :
                                                                                $t('map.selected_info.card.status.excluded') }}
                                                                </div>
                                                                <USwitch :model-value="isGeneralSelected(item.id)"
                                                                        @update:model-value="toggleGeneral(item.id)"
                                                                        color="primary" />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropertyType } from '~/types/property.type';
import { useFormat } from '~/composables/useFormat';
import { useExcel } from '~/composables/useExcel';

const { getThumbnailUrl } = useFormat();
const { downloadExcel } = useExcel();

const props = defineProps<{
        show: boolean;
        items: PropertyType[];
}>();

const emit = defineEmits<{
        (e: 'close'): void;
}>();

const selectedPropertiesSales = ref<string[]>([]);
const selectedPropertiesLeases = ref<string[]>([]);
const selectedPropertiesGeneral = ref<string[]>([]);

// Filters
const filterNoTransaction = ref(false);
const filterSale = ref(false);
const filterLease = ref(false);

// Helper Functions
const getLeases = (item: PropertyType) => {
        return item.transaction
                ?.filter(t => t.type === 'LEASE' && t.lease?.leaseType === 'ACTUAL')
                .map(t => t.lease!) || [];
};

const hasSale = (item: PropertyType) => {
        return item.transaction?.some(t => t.type === 'SALE');
};

const hasLease = (item: PropertyType) => {
        return getLeases(item).length > 0;
};

const filteredItems = computed(() => {
        if (!filterNoTransaction.value && !filterSale.value && !filterLease.value) {
                return props.items;
        }

        return props.items.filter(item => {
                const isNoTransaction = !hasSale(item) && !hasLease(item);
                const isSale = hasSale(item);
                const isLease = hasLease(item);

                if (filterNoTransaction.value && isNoTransaction) return true;
                if (filterSale.value && isSale) return true;
                if (filterLease.value && isLease) return true;

                return false;
        });
});

const formatDate = (date: Date | string | null) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}/${month}`;
};

const isSaleSelected = (propertyId: string, idx: number) => {
        return selectedPropertiesSales.value.includes(`${propertyId}-${idx}`);
};

const toggleSale = (propertyId: string, idx: number) => {
        const key = `${propertyId}-${idx}`;
        const index = selectedPropertiesSales.value.indexOf(key);
        if (index === -1) {
                selectedPropertiesSales.value.push(key);
        } else {
                selectedPropertiesSales.value.splice(index, 1);
        }
};

const isLeaseSelected = (propertyId: string, idx: number) => {
        return selectedPropertiesLeases.value.includes(`${propertyId}-${idx}`);
};

const toggleLease = (propertyId: string, idx: number) => {
        const key = `${propertyId}-${idx}`;
        const index = selectedPropertiesLeases.value.indexOf(key);
        if (index === -1) {
                selectedPropertiesLeases.value.push(key);
        } else {
                selectedPropertiesLeases.value.splice(index, 1);
        }
};

const isGeneralSelected = (propertyId: string) => {
        return selectedPropertiesGeneral.value.includes(propertyId);
};

const toggleGeneral = (propertyId: string) => {
        const index = selectedPropertiesGeneral.value.indexOf(propertyId);
        const item = props.items.find(i => i.id === propertyId);

        if (index === -1) {
                // Enable General
                selectedPropertiesGeneral.value.push(propertyId);

                // Auto-select all Sales and Leases for this property
                if (item) {
                        // Select Sales
                        if (item.transaction) {
                                item.transaction.forEach((t, idx) => {
                                        if (t.type === 'SALE') {
                                                const key = `${propertyId}-${idx}`;
                                                if (!selectedPropertiesSales.value.includes(key)) {
                                                        selectedPropertiesSales.value.push(key);
                                                }
                                        }
                                });
                        }

                        // Select Leases
                        const leases = getLeases(item);
                        leases.forEach((_, idx) => {
                                const key = `${propertyId}-${idx}`;
                                if (!selectedPropertiesLeases.value.includes(key)) {
                                        selectedPropertiesLeases.value.push(key);
                                }
                        });
                }
        } else {
                // Disable General
                selectedPropertiesGeneral.value.splice(index, 1);

                // Auto-deselect all Sales and Leases for this property
                if (item) {
                        // Deselect Sales
                        if (item.transaction) {
                                item.transaction.forEach((t, idx) => {
                                        if (t.type === 'SALE') {
                                                const key = `${propertyId}-${idx}`;
                                                const saleIndex = selectedPropertiesSales.value.indexOf(key);
                                                if (saleIndex !== -1) {
                                                        selectedPropertiesSales.value.splice(saleIndex, 1);
                                                }
                                        }
                                });
                        }

                        // Deselect Leases
                        const leases = getLeases(item);
                        leases.forEach((_, idx) => {
                                const key = `${propertyId}-${idx}`;
                                const leaseIndex = selectedPropertiesLeases.value.indexOf(key);
                                if (leaseIndex !== -1) {
                                        selectedPropertiesLeases.value.splice(leaseIndex, 1);
                                }
                        });
                }
        }
};

const onDownloadExcel = async () => {
        const dataToExport = props.items
                .filter(item => isGeneralSelected(item.id))
                .map(item => {
                        const newItem = { ...item };
                        if (newItem.transaction && newItem.transaction.length > 0) {
                                newItem.transaction = newItem.transaction.filter((t, idx) => {
                                        if (t.type === 'SALE') {
                                                return isSaleSelected(item.id, idx);
                                        } else if (t.type === 'LEASE') {
                                                const leases = getLeases(item);
                                                const leaseIdx = leases.findIndex(l => l === t.lease);
                                                if (leaseIdx !== -1) {
                                                        return isLeaseSelected(item.id, leaseIdx);
                                                }
                                                return false;
                                        }
                                        return false;
                                });
                        }
                        return newItem;
                });

        if (dataToExport.length > 0) {
                await downloadExcel(dataToExport);
        }
}

watch(() => props.items, (newItems) => {
        newItems.forEach(item => {
                if (!selectedPropertiesGeneral.value.includes(item.id)) {
                        selectedPropertiesGeneral.value.push(item.id);
                }

                if (item.transaction) {
                        item.transaction.forEach((t, idx) => {
                                if (t.type === 'SALE') {
                                        const key = `${item.id}-${idx}`;
                                        if (!selectedPropertiesSales.value.includes(key)) {
                                                selectedPropertiesSales.value.push(key);
                                        }
                                }
                        });
                }

                const leases = getLeases(item);
                leases.forEach((_, idx) => {
                        const key = `${item.id}-${idx}`;
                        if (!selectedPropertiesLeases.value.includes(key)) {
                                selectedPropertiesLeases.value.push(key);
                        }
                });
        });
}, { immediate: true });
</script>

<style scoped>
/* Custom Scrollbar for the modal content */
::-webkit-scrollbar {
        width: 8px;
}

::-webkit-scrollbar-track {
        background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
        background: #555;
}
</style>
