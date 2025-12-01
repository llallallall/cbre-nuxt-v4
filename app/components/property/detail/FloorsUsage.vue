<template>
        <div id="floor-usage-section" class="font-financier text-2xl text-cbre-green mb-[20px]">
                Floor Usage
        </div>

        <UAccordion :items="accordionItems" class="bg-white mb-[20px] border-t border-gray-200">
                <template #default="{ item, open }">
                        <UButton color="neutral" variant="ghost"
                                class="border-b border-gray-200 dark:border-gray-700 rounded-none p-3">
                                <template #leading>
                                        <div class="w-full text-left flex items-center">
                                                <span class="font-financier text-xl text-cbre-green mr-4">Floor
                                                        Usage</span>
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

                <template #content="{ item }">
                        <div class="w-full overflow-x-auto p-4">
                                <table class="w-full text-left border-collapse">
                                        <thead>
                                                <tr class="border-b border-gray-200">
                                                        <th v-for="header in floorHeaders" :key="header.value"
                                                                class="py-2 px-4 font-calibre text-cbre-green font-bold text-sm whitespace-nowrap">
                                                                {{ header.text }}
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(row, index) in info" :key="index"
                                                        class="border-b border-gray-100 hover:bg-gray-50">
                                                        <td class="py-2 px-4 text-sm">{{ row.type }}</td>
                                                        <td class="py-2 px-4 text-sm">{{ row.floor }}F</td>
                                                        <td class="py-2 px-4 text-sm">{{ row.use }}</td>
                                                        <td class="py-2 px-4 text-sm text-right">{{
                                                                formatNumber(row.totalAreaSqm) }}</td>
                                                        <td class="py-2 px-4 text-sm text-right">{{
                                                                formatNumber(row.netLeasableAreaSqm) }}</td>
                                                        <td class="py-2 px-4 text-sm text-right">{{
                                                                formatNumber(row.ceilingHeight) }}</td>
                                                        <td class="py-2 px-4 text-sm text-right">{{
                                                                formatNumber(row.floorLoad) }}</td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td :colspan="floorHeaders.length"
                                                                class="py-4 text-center text-gray-500 text-sm">
                                                                No floor usage information available.
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

const accordionItems = [{ label: 'Floor Usage', defaultOpen: true, slot: 'content' }];

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

<style scoped>
/* Scoped styles if needed */
</style>