<template>
        <UAccordion :items="[{ label: 'Floors Usage Summary', slot: 'content' }]"
                :ui="{ wrapper: 'w-full', item: { padding: 'pt-0 pb-2' } }">
                <template #default="{ item, open }">
                        <UButton color="gray" variant="ghost"
                                class="w-full flex justify-between items-center py-2 px-0">
                                <span class="font-financier text-2xl text-cbre-green">{{ item.label }}</span>
                                <div class="flex items-center gap-2">
                                        <div
                                                class="bg-cbre-green/10 text-cbre-green rounded-full px-4 py-1 min-w-[60px] flex justify-center items-center text-sm font-bold">
                                                {{ info ? info.length : 0 }}
                                        </div>
                                        <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                                class="w-5 h-5" />
                                </div>
                        </UButton>
                </template>

                <template #content>
                        <div class="font-calibreLight text-lg text-cbre-green w-full overflow-x-auto mt-2">
                                <table class="table-auto w-full border-collapse border border-gray-200 mb-5 text-sm">
                                        <thead>
                                                <tr class="font-calibre border bg-gray-100">
                                                        <th v-for="header in floorHeaders" :key="header.value"
                                                                class="whitespace-nowrap px-3 py-2 border border-gray-300 text-gray-700">
                                                                {{ header.text }}
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(floor, index) in info" :key="floor.id || index"
                                                        class="font-calibreLight hover:bg-gray-50">
                                                        <td class="px-3 py-2 border border-gray-200 text-center">{{
                                                                floor.type || '-' }}</td>
                                                        <td class="px-3 py-2 border border-gray-200 text-center">{{
                                                                floor.floor }}F</td>
                                                        <td class="px-3 py-2 border border-gray-200 text-center">{{
                                                                floor.use || '-' }}</td>
                                                        <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                                formatNumber(floor.totalAreaSqm)
                                                                }}</td>
                                                        <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                                formatNumber(floor.netLeasableAreaSqm) }}</td>
                                                        <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                                formatNumber(floor.ceilingHeight)
                                                                }}</td>
                                                        <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                                formatNumber(floor.floorLoad) }}
                                                        </td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td :colspan="floorHeaders.length"
                                                                class="text-center py-4 text-gray-500 italic">
                                                                No usage data available.
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

const floorHeaders = [
        { text: 'Type', value: 'type' },
        { text: 'Floor', value: 'floor' },
        { text: 'Usage', value: 'use' },
        { text: 'Total Area (㎡)', value: 'totalAreaSqm' },
        { text: 'NLA (㎡)', value: 'netLeasableAreaSqm' },
        { text: 'Ceiling (m)', value: 'ceilingHeight' },
        { text: 'Load (t/㎡)', value: 'floorLoad' },
];
</script>