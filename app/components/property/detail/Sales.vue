<template>
        <div id="sales-section" class="cbre-text-display-2 mb-[20px]">
                {{ $t('property.detail.sales.title') }}
        </div>

        <UAccordion :items="items" class="bg-white mb-[20px] border-t border-gray-200">
                <template #default="{ item, open }">
                        <UButton color="neutral" variant="ghost"
                                class="border-b border-gray-200 dark:border-gray-700 rounded-none !p-3">
                                <template #leading>
                                        <div class="w-full text-left flex items-center">
                                                <span class="cbre-text-display-3 mr-4">{{ $t('property.detail.sales.title') }}</span>
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
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                <UIcon name="i-heroicons-check" class="w-4 h-4" />
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                {{ $t('property.detail.sales.seller') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                {{ $t('property.detail.sales.buyer') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                {{ $t('property.detail.sales.yr_q') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                {{ $t('property.detail.sales.type') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.gfa') }}</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.nfa') }}</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.price') }}<sub>(KRW)</sub></th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.p_gfa') }}</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.p_nfa') }}</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.ecr') }}</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap text-right">
                                                                {{ $t('property.detail.sales.disc') }}</th>
                                                        <th
                                                                class="py-2 px-2 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                {{ $t('property.detail.sales.remarks') }}</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="border-b border-gray-100 hover:bg-gray-50">
                                                        <td class="py-2 px-2 text-center">
                                                                <input :id="'t' + idx" type="checkbox"
                                                                        class="ml-[4px]" />
                                                        </td>
                                                        <td class="py-2 px-2 text-base">{{ t.sale?.seller || '-' }}</td>
                                                        <td class="py-2 px-2 text-base">{{ t.sale?.buyer || '-' }}</td>
                                                        <td class="py-2 px-2 text-base text-center">{{ t.year }}-{{
                                                                t.quarter || 'Q?' }}</td>
                                                        <td class="py-2 px-2 text-base text-center">{{ t.sale?.saleType ||
                                                                '-' }}</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatDecimal(t.sale?.gfaSqm) }}</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatDecimal(t.sale?.nfaSqm) }}</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatInt(t.sale?.priceKrw) }}</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatInt(t.sale?.pricePerGfa) }}</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatInt(t.sale?.pricePerNfa) }}</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatDecimal(t.sale?.estCapRate) }}%</td>
                                                        <td class="py-2 px-2 text-base text-right">{{
                                                                formatDecimal(t.sale?.estDiscountRate) }}%</td>
                                                        <td class="py-2 px-2 text-base text-cbre-green truncate max-w-[150px]"
                                                                :title="t.sale?.remarks || ''">
                                                                {{ t.sale?.remarks }}
                                                        </td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="13" class="py-4 text-center text-cbre-green text-base">
                                                                {{ $t('property.detail.sales.no_data') || $t('common.no_data_found') }}
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

    const { t } = useI18n();
    const { numberFormat } = useFormat();
    const formatInt = (val: any) => numberFormat(val, 0);
    const formatDecimal = (val: any) => numberFormat(val, 2);

    const items = computed(() => [{ label: t('property.detail.sales.title'), defaultOpen: true }] as any[]);
</script>

<style scoped>
/* Scoped styles if needed */
</style>