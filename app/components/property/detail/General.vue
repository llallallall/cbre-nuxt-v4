<template>
        <h3 class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">{{ $t('property.detail.summary.title') }}</h3>

        <ul v-if="hasData"
                class="relative cbre_bulletList cbre-text-body-md text-cbre-green grid grid-cols-1 md:grid-cols-2 gap-4">

                <li v-if="profitability?.grade" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[140px] whitespace-nowrap text-right mr-4 font-normal font-calibre text-cbre-green">
                                {{ $t('property.detail.summary.grade') }} :
                        </div>
                        <div class="flex-1 font-semibold font-calibre text-cbre-green">
                                {{ profitability?.grade }}
                        </div>
                </li>
                <li v-if="profitability?.effectiveRatio" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[140px] whitespace-nowrap text-right mr-4 font-normal font-calibre text-cbre-green">
                                {{ $t('property.detail.summary.effective_ratio') }} :
                        </div>
                        <div class="flex-1 font-semibold font-calibre text-cbre-green">
                                {{ profitability?.effectiveRatio }} %
                        </div>
                </li>
                <li v-if="scale?.noOfBuildings" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[140px] whitespace-nowrap text-right mr-4 font-normal font-calibre text-cbre-green">
                                {{ $t('property.detail.summary.no_of_buildings') }} :
                        </div>
                        <div class="flex-1 font-semibold font-calibre text-cbre-green">
                                {{ scale?.noOfBuildings }}
                        </div>
                </li>
                <li v-if="sector?.name" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[140px] whitespace-nowrap text-right mr-4 font-normal font-calibre text-cbre-green">
                                {{ $t('property.detail.summary.sector') }} :
                        </div>
                        <div class="flex-1 font-semibold font-calibre text-cbre-green">
                                {{ sector?.name }}
                        </div>
                </li>
                <li v-if="subsector?.name" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="w-[140px] whitespace-nowrap text-right mr-4 font-normal font-calibre text-cbre-green">
                                {{ $t('property.detail.summary.subsector') }} :
                        </div>
                        <div class="flex-1 font-semibold font-calibre text-cbre-green">
                                {{ subsector?.name }}
                        </div>
                </li>
                <li v-if="sector?.name === 'Logistics' && warehouse && warehouse.length > 0"
                        class="flex items-start mt-0 col-span-full">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 mt-2 text-cbre-green" />
                        
                        <div class="flex-1">
                                <!-- Visual Chart -->
                                <div class="w-full mt-1">
                                        <!-- Bar -->
                                        
                                        <div class="w-full h-8 flex rounded-sm overflow-hidden mb-3">
                                                <div v-if="getWarehouseRatio('ROOM') > 0"
                                                        class="h-full bg-[#78B8AA] flex items-center justify-center text-white text-xs font-bold transition-all duration-1000 ease-out relative group"
                                                        :style="{ width: showChart ? getWarehouseRatio('ROOM') + '%' : '0%' }">
                                                        <span v-if="getWarehouseRatio('ROOM') > 10">{{
                                                                getWarehouseRatio('ROOM') }}%</span>
                                                </div>
                                                <div v-if="getWarehouseRatio('LOW') > 0"
                                                        class="h-full bg-[#3E494C] flex items-center justify-center text-white text-xs font-bold transition-all duration-1000 ease-out relative group"
                                                        :style="{ width: showChart ? getWarehouseRatio('LOW') + '%' : '0%' }">
                                                        <span v-if="getWarehouseRatio('LOW') > 10">{{
                                                                getWarehouseRatio('LOW') }}%</span>
                                                </div>
                                                <div v-if="getWarehouseRatio('CONSTANT') > 0"
                                                        class="h-full bg-[#00D084] flex items-center justify-center text-white text-xs font-bold transition-all duration-1000 ease-out relative group"
                                                        :style="{ width: showChart ? getWarehouseRatio('CONSTANT') + '%' : '0%' }">
                                                        <span v-if="getWarehouseRatio('CONSTANT') > 10">{{
                                                                getWarehouseRatio('CONSTANT') }}%</span>
                                                </div>
                                        </div>

                                        <!-- Legend -->
                                        <div class="flex flex-wrap gap-4 text-sm font-calibre text-cbre-green">
                                                <div class="whitespace-nowrap text-right mr-4 font-normal font-calibre text-cbre-green pt-1">
                                                        Usage :
                                                </div>
                                                <div v-if="getWarehouseRatio('ROOM') > 0" class="flex items-center">
                                                        <div class="w-3 h-3 bg-[#78B8AA] rounded-sm mr-2"></div>
                                                        <span>{{ $t('property.detail.summary.warehouse_room') }} ({{ getWarehouseRatio('ROOM') }}%)</span>
                                                </div>
                                                <div v-if="getWarehouseRatio('LOW') > 0" class="flex items-center">
                                                        <div class="w-3 h-3 bg-[#3E494C] rounded-sm mr-2"></div>
                                                        <span>{{ $t('property.detail.summary.warehouse_low') }} ({{ getWarehouseRatio('LOW') }}%)</span>
                                                </div>
                                                <div v-if="getWarehouseRatio('CONSTANT') > 0" class="flex items-center">
                                                        <div class="w-3 h-3 bg-[#00D084] rounded-sm mr-2"></div>
                                                        <span>{{ $t('property.detail.summary.warehouse_constant') }} ({{ getWarehouseRatio('CONSTANT') }}%)</span>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </li>
        </ul>
        <div v-else class="py-10 text-center text-cbre-blue text-base italic">
                No property summary information available.
        </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { ProfitabilityType, ScaleType, SectorType, SubSectorType, WarehouseType } from '~/types/property.type';

const props = defineProps<{
        profitability: ProfitabilityType | null | undefined;
        scale: ScaleType | null | undefined;
        sector: SectorType | null | undefined;
        subsector: SubSectorType | null | undefined;
        warehouse: WarehouseType[] | null | undefined;
}>();

const hasData = computed(() => {
        return !!(props.profitability?.grade ||
                props.profitability?.effectiveRatio ||
                props.scale?.noOfBuildings ||
                props.sector?.name ||
                props.subsector?.name ||
                (props.sector?.name === 'Logistics' && props.warehouse && props.warehouse.length > 0));
});

const getWarehouseRatio = (type: string) => {
        const w = props.warehouse?.find((item: any) => item.temperatureType === type);
        return Number(w?.ratio) || 0;
};

const showChart = ref(false);

onMounted(() => {
    setTimeout(() => {
        showChart.value = true;
    }, 300);
});
</script>

