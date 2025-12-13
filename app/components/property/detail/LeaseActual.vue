<template>
        <div id="lease-actual-section" class="cbre-text-display-2 mb-[20px]">
                {{ $t('property.detail.lease.actual_title') }}
        </div>

        <UAccordion :items="items" class="bg-white mb-[20px] border-t border-gray-200">
                <template #default="{ item, open }">
                        <UButton color="neutral" variant="ghost"
                                class="border-b border-gray-200 dark:border-gray-700 rounded-none !p-3">
                                <template #leading>
                                        <div class="w-full text-left flex items-center">
                                                <span class="cbre-text-display-3 mr-4">{{ $t('property.detail.lease.actual_title') }}</span>
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
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base">
                                                                <UIcon name="i-heroicons-check-circle"
                                                                        class="w-5 h-5" />
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base">
                                                                {{ $t('property.detail.lease.floor') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base">
                                                                {{ $t('property.detail.lease.unit') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base">
                                                                {{ $t('property.detail.lease.date') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.sizes.gfa') }}(Sqm)</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.sizes.gfa') }}(Py)</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.sizes.nfa') }}(Sqm)</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.sizes.nfa') }}(Py)</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.eff_ratio') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.monthly_rent') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.monthly_camf') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.deposit') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.rent_mth_py') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.camf_mth_py') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.deposit_py') }}
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.iod') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.gdm') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.noc') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                {{ $t('property.detail.lease.lease_term') }}</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Rent Free
                                                                Type</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Rent Free
                                                                Mth</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Effective
                                                                Noc</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Fit-Out</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Amount Krw
                                                        </th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Amount Nfa
                                                                Py</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Total Free
                                                                Rent Period Mth</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Total
                                                                Occupying Period Year</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Total Free
                                                                Rent Occupying Year</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                Monthly Cash
                                                                Support Gfa</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                All In
                                                                Effective Rent Mth Py</th>
                                                        <th
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base text-right">
                                                                All In Noc
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="border-b border-gray-100 hover:bg-gray-50">
                                                        <td class="py-2 px-4 text-center">
                                                                <input :id="'lt' + idx" type="checkbox"
                                                                        class="ml-[4px]" />
                                                        </td>
                                                        <td class="py-2 px-4 text-base text-center">{{ t.lease?.floor ||
                                                                '-' }}</td>
                                                        <td class="py-2 px-4 text-base text-center">{{ t.lease?.unit ||
                                                                '-' }}</td>
                                                        <td class="py-2 px-4 text-base text-center">{{
                                                                formatDate(t.lease?.leaseStartDate) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.gfaSqm) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.gfaPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.nfaSqm) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.nfaPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.effRatio) }}%</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.monthlyRent) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.monthlyCamf) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.deposit) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.rentMonthlyPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.camfMonthlyPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.depositPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.iod) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.gdm) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.noc) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                t.lease?.leaseTermYear || '-' }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                t.lease?.rentFreeType || '-' }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                t.lease?.rentFreeMonth || '-' }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.effectiveNoc) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.fitOut) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.tiAmountKrw) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.tiAmountNfaPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.totalFreeRentPeriodMonth) }}
                                                        </td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.totalOccupyingPeriodYear) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.totalFreeRentOccupyingYear) }}
                                                        </td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.monthlyCashSupportGfa) }}
                                                        </td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatInt(t.lease?.allInEffectiveRentMonthlyPy) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatDecimal(t.lease?.allInNoc) }}</td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="31" class="py-4 text-center text-cbre-green text-base">
                                                                {{ $t('common.no_data_found') }}
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

    const items = computed(() => [{ label: t('property.detail.lease.actual_title'), defaultOpen: true }] as any[]);

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