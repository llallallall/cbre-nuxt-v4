<template>
  <div>
    <div class="py-2 font-financier text-2xl text-cbre-green w-full ">
      <div class="flex justify-between gap-3 w-full mb-5">
        <div class="w-1/2 flex justify-start">Floors Information</div>
        <div class="w-1/2 flex justify-end">
          <div class="bg-cbre-green/10 hover:bg-cbre-green/25 
                      text-cbre-green rounded-full
                      px-4 py-1 min-w-[100px]
                      flex justify-center items-center font-bold">
            {{ info ? info.length : 0 }}
          </div>
        </div>
      </div>
    </div>

    <div class="shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
      <UTable :rows="(info as any[])" :columns="(columns as any[])" :ui="{
        th: { base: 'px-4 py-3 text-gray-700 font-semibold text-xs' },
        td: { base: 'px-4 py-3 text-gray-800 text-sm' }
      } as any">
        <!-- Expand Button Column -->
        <template #expand-data="{ row }">
          <UButton variant="ghost" color="neutral"
            :icon="(row as any).isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
            @click="(row as any).isExpanded = !(row as any).isExpanded" />
        </template>

        <!-- Floor & Type Column -->
        <template #floorDetails-data="{ row }">
          {{ (row as any).type === 'BASEMENT' ? 'B' : '' }}{{ Math.abs((row as any).floor || 0) }}F
          <span class="text-gray-400 text-xs ml-1">({{ (row as any).use || 'General' }})</span>
        </template>

        <!-- Numeric Columns -->
        <template #ceilingHeight-data="{ row }">
          <div class="text-right">{{ formatNumber((row as any).ceilingHeight) }} {{ (row as any).ceilingHeightUnit ||
            'm' }}
          </div>
        </template>
        <template #floorLoad-data="{ row }">
          <div class="text-right">{{ formatNumber((row as any).floorLoad) }} {{ (row as any).floorLoadUnit || 't/㎡' }}
          </div>
        </template>
        <template #totalAreaSqm-data="{ row }">
          <div class="text-right font-medium">{{ formatNumber((row as any).totalAreaSqm) }}</div>
        </template>
        <template #truckBerths-data="{ row }">
          <div class="text-right">{{ (row as any).truckBerths || '0' }}</div>
        </template>

        <!-- Expand Slot -->
        <template #expand="{ row }">
          <div class="p-4 bg-gray-50 border-t border-gray-200 shadow-inner">
            <h4 class="text-sm font-bold text-gray-700 mb-3 ml-1">
              Unit Details ({{ (row as any).floorPartial ? (row as any).floorPartial.length : 0 }})
            </h4>

            <div v-if="(row as any).floorPartial && (row as any).floorPartial.length > 0"
              class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <UTable :rows="((row as any).floorPartial as any[])" :columns="(subColumns as any[])" :ui="{
                th: { base: 'px-3 py-2 text-gray-600 font-semibold text-xs' },
                td: { base: 'px-3 py-2 text-gray-600 text-sm' }
              } as any">
                <template #unitNumber-data="{ row: subRow }">
                  <span class="font-medium text-gray-800">{{ (subRow as any).unitNumber || '-' }}</span>
                </template>
                <template #tenant-data="{ row: subRow }">
                  <span class="truncate max-w-[150px]" :title="(subRow as any).tenant || ''">{{ (subRow as any).tenant
                    ||
                    'Vacant' }}</span>
                </template>
                <template #leaseAreaPy-data="{ row: subRow }">
                  <div class="text-right font-medium text-indigo-600">{{ formatNumber((subRow as any).leaseAreaPy) }}
                  </div>
                </template>
                <template #depositKrw-data="{ row: subRow }">
                  <div class="text-right">{{ formatNumber((subRow as any).depositKrw) }}</div>
                </template>
                <template #monthlyRent-data="{ row: subRow }">
                  <div class="text-right">{{ formatNumber((subRow as any).monthlyRent) }}</div>
                </template>
                <template #monthlyManagementFee-data="{ row: subRow }">
                  <div class="text-right">{{ formatNumber((subRow as any).monthlyManagementFee) }}</div>
                </template>
                <template #term-data="{ row: subRow }">
                  <div class="text-center">
                    {{ (subRow as any).leaseStartDate ? formatDate((subRow as any).leaseStartDate) : '' }}
                    <span v-if="(subRow as any).leaseStartDate && (subRow as any).leaseEndDate">~</span>
                    {{ (subRow as any).leaseEndDate ? formatDate((subRow as any).leaseEndDate) : '' }}
                  </div>
                </template>
                <template #rentFree-data="{ row: subRow }">
                  <span class="truncate max-w-[100px]" :title="(subRow as any).rentFree || ''">
                    {{ (subRow as any).rentFree || '-' }}</span>
                </template>
              </UTable>
            </div>
            <p v-else class="text-sm text-gray-400 italic ml-1">
              No detailed unit information available for this floor.
            </p>
          </div>
        </template>
      </UTable>
    </div>

    <div v-if="!info || info.length === 0" class="text-center py-10 text-gray-500">
      <p>No floor data available to display.</p>
    </div>
  </div>
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

const columns = [
  { key: 'expand', label: 'Details', class: 'w-16' },
  { key: 'floorDetails', label: 'Floor & Type' },
  { key: 'ceilingHeight', label: 'Ceiling Height', class: 'hidden sm:table-cell text-right' },
  { key: 'floorLoad', label: 'Floor Load', class: 'hidden md:table-cell text-right' },
  { key: 'totalAreaSqm', label: 'Total Area (㎡)', class: 'text-right' },
  { key: 'truckBerths', label: 'Truck Berths', class: 'hidden lg:table-cell text-right' }
];

const subColumns = [
  { key: 'unitNumber', label: 'Unit No.', class: 'w-20' },
  { key: 'tenant', label: 'Tenant', class: 'w-32' },
  { key: 'leaseAreaPy', label: 'Area (PY)', class: 'text-right w-24' },
  { key: 'depositKrw', label: 'Deposit', class: 'text-right hidden sm:table-cell' },
  { key: 'monthlyRent', label: 'Rent', class: 'text-right hidden md:table-cell' },
  { key: 'monthlyManagementFee', label: 'Mgt Fee', class: 'text-right hidden md:table-cell' },
  { key: 'term', label: 'Term', class: 'text-center hidden lg:table-cell' },
  { key: 'rentFree', label: 'Rent Free', class: 'hidden xl:table-cell' }
];

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  return numberFormat(value, 0);
};

const formatDate = (date: Date | string | null): string => {
  if (!date) return '-';
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  return dateObj.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
};
</script>