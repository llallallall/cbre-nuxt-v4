<template>
        <div id="sales-section" class="font-financier text-2xl text-cbre-green mb-[20px]">
                Sales Transaction
        </div>

        <UAccordion :items="items" class="bg-white mb-[20px] border-t border-gray-200">
                <template #default="{ item, open }">
                        <UButton color="neutral" variant="ghost"
                                class="border-b border-gray-200 dark:border-gray-700 rounded-none !p-3">
                                <template #leading>
                                        <div class="w-full text-left flex items-center">
                                                <span class="font-financier text-xl text-cbre-green mr-4">Sales
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
                                <table class="w-full text-left border-collapse">
                                        <thead>
                                                <tr class="border-b border-gray-200">
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                <UIcon name="i-heroicons-check" class="w-4 h-4" />
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                Seller
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                Buyer
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                YR-Q
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                Type
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                GFA</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                NFA</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                Price<sub>(KRW)</sub></th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                P/GFA</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                P/NFA</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                ECR</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap text-right">
                                                                Disc.</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                Remarks</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="border-b border-gray-100 hover:bg-gray-50">
                                                        <td class="py-2 px-2 text-center">
                                                                <input :id="'t' + idx" type="checkbox"
                                                                        class="ml-[4px]" />
                                                        </td>
                                                        <td class="py-2 px-2 text-sm">{{ t.sale?.seller || '-' }}</td>
                                                        <td class="py-2 px-2 text-sm">{{ t.sale?.buyer || '-' }}</td>
                                                        <td class="py-2 px-2 text-sm text-center">{{ t.year }}-{{
                                                                t.quarter || 'Q?' }}</td>
                                                        <td class="py-2 px-2 text-sm text-center">{{ t.sale?.saleType ||
                                                                '-' }}</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatDecimal(t.sale?.gfaSqm) }}</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatDecimal(t.sale?.nfaSqm) }}</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatInt(t.sale?.priceKrw) }}</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatInt(t.sale?.pricePerGfa) }}</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatInt(t.sale?.pricePerNfa) }}</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatDecimal(t.sale?.estCapRate) }}%</td>
                                                        <td class="py-2 px-2 text-sm text-right">{{
                                                                formatDecimal(t.sale?.estDiscountRate) }}%</td>
                                                        <td class="py-2 px-2 text-xs text-gray-500 truncate max-w-[150px]"
                                                                :title="t.sale?.remarks || ''">
                                                                {{ t.sale?.remarks }}
                                                        </td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="13" class="py-4 text-center text-gray-500 text-sm">
                                                                No Sales Data
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

const items = [{ label: 'Sales Transaction', defaultOpen: true }] as any[];
</script>

<style scoped>
/* Scoped styles if needed */
</style>