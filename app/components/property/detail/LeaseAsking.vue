<template>
        <div id="lease-asking-section" class="font-financier text-2xl text-cbre-green mb-[20px]">
                Asking Lease Transaction
        </div>

        <UAccordion :items="items" class="bg-white mb-[20px] border-t border-gray-200">
                <template #default="{ item, open }">
                        <UButton color="neutral" variant="ghost"
                                class="border-b border-gray-200 dark:border-gray-700 rounded-none !p-3">
                                <template #leading>
                                        <div class="w-full text-left flex items-center">
                                                <span class="font-financier text-xl text-cbre-green mr-4">Asking Lease
                                                        Transaction</span>
                                                <div
                                                        class="bg-cbre-green/10 text-cbre-green rounded-full px-4 py-1 min-w-[60px] flex justify-center items-center text-sm font-bold">
                                                        {{ info ? info.length : 0 }}
                                                </div>
                                        </div>
                                </template>
                                <template #trailing>
                                        <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                                class="w-5 h-5 ms-auto transform transition-transform duration-200" />
                                </template>
                        </UButton>
                </template>

                <template #item>
                        <div class="w-full overflow-x-auto p-4">
                                <table class="w-full text-left border-collapse whitespace-nowrap">
                                        <thead>
                                                <tr class="border-b border-gray-200">
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm">
                                                                #</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm">
                                                                Floor</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm">
                                                                Unit</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm">
                                                                Date</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm text-right">
                                                                Rent</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm text-right">
                                                                NOC</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="border-b border-gray-100 hover:bg-gray-50">
                                                        <td class="py-2 px-4 text-center">
                                                                <input type="checkbox" />
                                                        </td>
                                                        <td class="py-2 px-4 text-sm text-center">{{ t.lease?.floor ||
                                                                '-' }}</td>
                                                        <td class="py-2 px-4 text-sm text-center">{{ t.lease?.unit ||
                                                                '-' }}</td>
                                                        <td class="py-2 px-4 text-sm text-center">{{
                                                                formatDate(t.lease?.leaseStartDate) }}</td>
                                                        <td class="py-2 px-4 text-sm text-right">{{
                                                                formatInt(t.lease?.rentMonthlyPy) }}</td>
                                                        <td class="py-2 px-4 text-sm text-right">{{
                                                                formatDecimal(t.lease?.noc) }}</td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="6" class="py-4 text-center text-gray-500 text-sm">
                                                                No Asking Lease Data
                                                        </td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </template>
        </UAccordion>
</template>

<script setup lang="ts">
import { useFormat } from '~/composables/useFormat';
import type { TransactionType } from '~/types/property.type';

const props = withDefaults(defineProps<{
        info?: TransactionType[]
}>(), {
        info: () => []
});

const { numberFormat } = useFormat();
const formatInt = (val: any) => numberFormat(val, 0);
const formatDecimal = (val: any) => numberFormat(val, 2);

const items = [{ label: 'Asking Lease Transaction', defaultOpen: true }] as any[];

const formatDate = (dateInput: Date | string | null | undefined): string => {
        if (!dateInput) return '-';
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) return '-';
        return date.toISOString().split('T')[0] || '-';
};
</script>

<style scoped>
/* Scoped styles if needed */
</style>