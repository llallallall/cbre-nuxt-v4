<template>
        <UModal :model-value="show" @update:model-value="emit('close')" fullscreen
                :ui="{ background: 'bg-transparent', overlay: { background: 'bg-black/25 backdrop-blur-sm' } }">
                <div class="fixed inset-0 overflow-auto flex items-center justify-center p-4 mt-[80px]">
                        <div
                                class="bg-white w-full max-w-[calc(100%-100px)] max-h-[calc(100%-100px)] rounded-xl shadow-xl flex flex-col overflow-hidden relative">

                                <!-- Header -->
                                <div class="p-6 pb-0 flex justify-between items-start">
                                        <div class="flex flex-col gap-2 w-full">
                                                <div
                                                        class="flex items-end justify-between w-full border-b border-gray-200 pb-4">
                                                        <h3
                                                                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-cbre-green">
                                                                Selected Properties Information
                                                        </h3>

                                                        <div class="flex items-center gap-4">
                                                                <!-- Download Excel -->
                                                                <div class="flex flex-col items-center cursor-pointer group"
                                                                        @click="onDownloadExcel()">
                                                                        <div
                                                                                class="flex items-center gap-2 px-3 py-1 border-2 border-cbre-green rounded-xl bg-[#e6eaea] hover:bg-cbre-green/10 transition-colors">
                                                                                <UIcon name="i-vscode-icons-file-type-excel2"
                                                                                        class="w-[18px] h-[18px]" />
                                                                                <span
                                                                                        class="font-calibreLight text-sm leading-none">
                                                                                        <span
                                                                                                class="mx-1">Download</span>
                                                                                        <span
                                                                                                class="hidden lg:block">Excel</span>
                                                                                </span>
                                                                        </div>
                                                                </div>

                                                                <!-- No Transaction Filter -->
                                                                <div class="flex flex-col items-center gap-1">
                                                                        <span
                                                                                class="font-calibreLight text-sm leading-none flex">
                                                                                <span class="mx-1">No</span>
                                                                                <span
                                                                                        class="hidden lg:block">Transaction</span>
                                                                        </span>
                                                                        <UToggle v-model="filterNoTransaction"
                                                                                color="cbre-green" />
                                                                </div>

                                                                <!-- Sales Filter -->
                                                                <div class="flex flex-col items-center gap-1">
                                                                        <span
                                                                                class="font-calibreLight text-sm leading-none flex">
                                                                                <span
                                                                                        class="mx-1 hidden lg:block">All</span>
                                                                                <span>Sales</span>
                                                                        </span>
                                                                        <UToggle v-model="filterSale"
                                                                                color="cbre-green" />
                                                                </div>

                                                                <!-- Leases Filter -->
                                                                <div class="flex flex-col items-center gap-1">
                                                                        <span
                                                                                class="font-calibreLight text-sm leading-none flex">
                                                                                <span
                                                                                        class="mx-1 hidden lg:block">All</span>
                                                                                <span>Leases</span>
                                                                        </span>
                                                                        <UToggle v-model="filterLease"
                                                                                color="cbre-green" />
                                                                </div>
                                                        </div>
                                                </div>
                                                <p class="text-sm text-gray-500 mt-2">
                                                        The filters above apply only to the screen view. Use the toggles
                                                        on each card to control data inclusion in the Excel download.
                                                </p>
                                        </div>

                                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                                                class="absolute top-4 right-4" @click="emit('close')" />
                                </div>

                                <!-- Content -->
                                <div class="p-6 overflow-y-auto bg-white flex-1">
                                        <div
                                                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
                                                <div v-for="(item, index) in filteredItems" :key="item.id"
                                                        class="border border-cbre-green/10 p-4 shadow-md transition-colors duration-200 flex flex-col gap-2"
                                                        :class="isGeneralSelected(item.id) ? 'bg-white' : 'bg-gray-100'">

                                                        <div class="font-financierMedium text-2xl text-cbre-green pb-2 mb-2 border-b border-gray-200 truncate"
                                                                :title="item.name">
                                                                {{ item.name }}
                                                        </div>

                                                        <div
                                                                class="font-calibreLight text-lg text-cbre-green pb-2 mb-2 border-b border-gray-200 flex justify-between">
                                                                <div class="flex flex-col">
                                                                        <span class="font-calibre">Grade</span>
                                                                        <span>{{ item.profitability?.grade || 'N/A'
                                                                                }}</span>
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <span class="font-calibre">Sector</span>
                                                                        <span class="text-sm">{{ item.sector?.name ||
                                                                                'N/A' }}</span>
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <span class="font-calibre">SubSector</span>
                                                                        <span class="text-sm">{{ item.subsector?.name ||
                                                                                'N/A' }}</span>
                                                                </div>
                                                        </div>

                                                        <div
                                                                class="flex justify-start items-center gap-3 select-none overflow-x-auto pb-2">
                                                                <div v-for="preview in item.propertyImageFile"
                                                                        :key="preview.id"
                                                                        class="w-[120px] h-[90px] min-w-[120px] border-white/25 border border-gray-400 hover:scale-105 transition-all cursor-pointer">
                                                                        <img :src="getThumbnailUrl(preview.fileUrl)"
                                                                                class="object-cover w-full h-full" />
                                                                </div>
                                                        </div>

                                                        <ul
                                                                class="font-calibreLight text-lg text-cbre-green grid grid-cols-2 gap-5 flex-1">
                                                                <!-- Sales -->
                                                                <li class="flex flex-col"
                                                                        v-if="item.transaction && item.transaction.some(t => t.type === 'SALE')">
                                                                        <div
                                                                                class="whitespace-nowrap mr-4 font-calibre">
                                                                                Sales</div>
                                                                        <div class="flex-1 flex flex-col gap-1">
                                                                                <div v-for="(el, idx) in item.transaction.filter(t => t.type === 'SALE')"
                                                                                        :key="idx"
                                                                                        class="flex flex-row items-center justify-between text-sm">
                                                                                        <span>{{ idx + 1 }}. {{ el.year
                                                                                                }}/{{ el.quarter }}
                                                                                                :</span>
                                                                                        <UToggle :model-value="isSaleSelected(item.id, idx)"
                                                                                                @update:model-value="toggleSale(item.id, idx)"
                                                                                                color="cbre-green"
                                                                                                size="sm" />
                                                                                </div>
                                                                        </div>
                                                                </li>

                                                                <!-- Leases -->
                                                                <li v-if="getLeases(item).length > 0"
                                                                        class="flex flex-col">
                                                                        <div
                                                                                class="whitespace-nowrap mr-4 font-calibre">
                                                                                Leases</div>
                                                                        <div class="flex-1 flex flex-col gap-1">
                                                                                <div v-for="(el, idx) in getLeases(item)"
                                                                                        :key="idx"
                                                                                        class="flex flex-row items-center justify-between text-sm">
                                                                                        <span>{{ idx + 1 }}. {{
                                                                                                formatDate(el.leaseStartDate)
                                                                                                }} :</span>
                                                                                        <UToggle :model-value="isLeaseSelected(item.id, idx)"
                                                                                                @update:model-value="toggleLease(item.id, idx)"
                                                                                                color="cbre-green"
                                                                                                size="sm" />
                                                                                </div>
                                                                        </div>
                                                                </li>
                                                        </ul>

                                                        <div
                                                                class="flex flex-row items-center justify-between mt-auto pt-2 border-t border-gray-100">
                                                                <div class="font-calibreLight text-sm"
                                                                        :class="isGeneralSelected(item.id) ? 'text-teal-700' : 'text-red-400'">
                                                                        {{ isGeneralSelected(item.id) ? 'Included in
                                                                        Excel' : 'Excluded from Excel' }}
                                                                </div>
                                                                <UToggle :model-value="isGeneralSelected(item.id)"
                                                                        @update:model-value="toggleGeneral(item.id)"
                                                                        color="cbre-green" />
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
