<template>
        <UAccordion :items="accordionItems" default-value="floor-usage" class="bg-white">
                <template #default="{ item, open }">
                        <div class="w-full flex items-center justify-between py-3">
                                <div class="text-left flex items-center">
                                        <h3
                                                class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">
                                                {{ $t('nav.anchor.floors') }}</h3>
                                        <div
                                                class="ml-4 bg-cbre-green/10 text-cbre-green rounded-full px-4 py-1 min-w-[60px] flex justify-center items-center text-sm font-bold">
                                                {{ info ? info.length : 0 }}
                                        </div>
                                </div>
                                <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                        class="w-5 h-5 ms-auto transform transition-transform duration-200" />
                        </div>
                </template>

                <template #content="{ item }">
                        <div class="w-full overflow-x-auto p-4">
                                <table class="w-full text-left border-collapse">
                                        <thead>
                                                <tr class="border-b border-gray-200">
                                                        <th v-for="header in floorHeaders" :key="header.value"
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-base whitespace-nowrap">
                                                                {{ header.text }}
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(row, index) in info" :key="index"
                                                        class="border-b border-gray-100 hover:bg-gray-50">
                                                        <td class="py-2 px-4 text-base">{{ row.type }}</td>
                                                        <td class="py-2 px-4 text-base">{{ row.floor }}F</td>
                                                        <td class="py-2 px-4 text-base">{{ row.use }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatNumber(row.totalAreaSqm) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatNumber(row.netLeasableAreaSqm) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatNumber(row.ceilingHeight) }}</td>
                                                        <td class="py-2 px-4 text-base text-right">{{
                                                                formatNumber(row.floorLoad) }}</td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td :colspan="floorHeaders.length"
                                                                class="py-10 text-center text-cbre-blue text-base italic">
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
import type { FloorType } from '~/types/property.type';

    const { t } = useI18n();

    const accordionItems = computed(() => [{ label: t('property.detail.floors.usage_title'), value: 'floor-usage', slot: 'content' }]);

    const props = withDefaults(defineProps<{
        info?: FloorType[]
    }>(), {
        info: () => []
    });

    const { numberFormat } = useFormat();
    const formatNumber = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '-';
        return numberFormat(val, 0);
    };

    const floorHeaders = computed(() => [
        { text: t('property.detail.floors.type'), value: 'type' },
        { text: t('property.detail.floors.floor'), value: 'floor' },
        { text: t('property.detail.floors.usage'), value: 'use' },
        { text: `${t('property.detail.floors.total_area')} (㎡)`, value: 'totalAreaSqm' },
        { text: `${t('property.detail.floors.nla')} (㎡)`, value: 'netLeasableAreaSqm' },
        { text: `${t('property.detail.floors.ceiling')} (m)`, value: 'ceilingHeight' },
        { text: `${t('property.detail.floors.load')} (t/㎡)`, value: 'floorLoad' },
    ]);
</script>

<style scoped>
/* Scoped styles if needed */
</style>