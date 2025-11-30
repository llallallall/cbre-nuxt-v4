<template>
        <div class="w-full">
                <button @click="isOpen = !isOpen"
                        class="py-2 font-financier text-2xl text-primary w-full text-left bg-transparent border-none cursor-pointer">
                        <div class="flex justify-between gap-3 w-full">
                                <div class="w-1/2 flex justify-start items-center">
                                        Sales Information
                                        <UIcon :name="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                                class="ml-2 w-5 h-5" />
                                </div>
                                <div class="w-1/2 flex justify-end">
                                        <div v-if="info && info.length > 0" class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info.length }}
                                        </div>
                                </div>
                        </div>
                </button>
                <div v-show="isOpen" class="font-calibreLight text-lg text-primary">
                        <div class="overflow-x-auto">
                                <table class="table-auto w-full border border-gray-200">
                                        <thead class="bg-gray-50">
                                                <tr class="font-calibre text-sm text-gray-600 border-b">
                                                        <th class="px-2 py-1 w-8">
                                                                <UIcon name="i-heroicons-arrows-up-down"
                                                                        class="w-4 h-4" />
                                                        </th>
                                                        <th class="px-2 py-1 text-left">Seller</th>
                                                        <th class="px-2 py-1 text-left">Buyer</th>
                                                        <th class="px-2 py-1 text-center">YR-Q</th>
                                                        <th class="px-2 py-1 text-center">Type</th>
                                                        <th class="px-2 py-1 text-right">GFA</th>
                                                        <th class="px-2 py-1 text-right">NFA</th>
                                                        <th class="px-2 py-1 text-right">Price<sub>(KRW)</sub></th>
                                                        <th class="px-2 py-1 text-right">P/GFA</th>
                                                        <th class="px-2 py-1 text-right">P/NFA</th>
                                                        <th class="px-2 py-1 text-right">ECR</th>
                                                        <th class="px-2 py-1 text-right">Disc.</th>
                                                        <th class="px-2 py-1 text-left">Remarks</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="font-calibreLight text-sm border-b hover:bg-gray-50">
                                                        <td class="text-center"><input :id="'t' + idx" type="checkbox"
                                                                        class="ml-[4px]" /></td>

                                                        <td class="px-2 py-1">{{ t.sale?.seller || '-' }}</td>
                                                        <td class="px-2 py-1">{{ t.sale?.buyer || '-' }}</td>
                                                        <td class="px-2 py-1 text-center">{{ t.year }}-{{ t.quarter ||
                                                                'Q?' }}</td>
                                                        <td class="px-2 py-1 text-center">{{ t.sale?.saleType || '-' }}
                                                        </td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.gfaSqm) }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.nfaSqm) }}</td>
                                                        <td class="px-2 py-1 text-right">{{ formatInt(t.sale?.priceKrw)
                                                                }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatInt(t.sale?.pricePerGfa) }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatInt(t.sale?.pricePerNfa) }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.estCapRate) }}%</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.estDiscountRate) }}%</td>
                                                        <td class="px-2 py-1 text-xs text-gray-500 truncate max-w-[150px]"
                                                                :title="t.sale?.remarks || ''">
                                                                {{ t.sale?.remarks }}
                                                        </td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="13" class="text-center py-4 text-gray-500 italic">
                                                                No Sales Data</td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormat } from '~/composables/useFormat';
// 💡 1. 타입 임포트 추가
import type { TransactionType } from '~/types/property.type';

// 💡 2. defineProps에 Generic Type 적용
const props = withDefaults(defineProps<{
        info?: TransactionType[]
}>(), {
        info: () => []
});

const isOpen = ref(false);

const { numberFormat } = useFormat();
const formatInt = (val: any) => numberFormat(val, 0);
const formatDecimal = (val: any) => numberFormat(val, 2);
</script>