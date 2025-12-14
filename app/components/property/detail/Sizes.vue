<template>
        <h3 class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">{{ $t('nav.anchor.sizes') }}</h3>
        <div v-if="hasData">
        <ul
                class="cbre_bulletList font-calibreLight cbre-text-body-lg text-cbre-green grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-y-2">

                <li class="flex items-center" v-if="scale?.gfaSqm && scale.gfaSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">{{ $t('property.detail.sizes.gfa') }} :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.gfaSqm) }} ㎡ ({{ formatDecimal(scale?.gfaPy) }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="scale?.nfaSqm && scale.nfaSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">{{ $t('property.detail.sizes.nfa') }} :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.nfaSqm) }} ㎡ ({{ formatDecimal(scale?.nfaPy) }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="scale?.siteAreaSqm && scale.siteAreaSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">{{ $t('property.detail.sizes.land_area') }} :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.siteAreaSqm) }} ㎡ ({{ formatDecimal(scale?.siteAreaPy)
                                }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="scale?.floorPlateSqm && scale.floorPlateSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">{{ $t('property.detail.sizes.floor_plate') }} :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.floorPlateSqm) }} ㎡ ({{
                                        formatDecimal(scale?.floorPlatePy) }} py)
                        </div>
                </li>

        </ul>

        <ul class="cbre_bulletList font-calibreLight cbre-text-body-lg text-cbre-green grid grid-cols-1 mt-2 gap-y-2">
                <li class="flex items-center" v-if="scale?.floorAreaRatioExisting && scale.floorAreaRatioExisting > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">{{ $t('property.detail.sizes.floor_area_ratio') }} :
                        </div>
                        <div class="flex-1">
                                {{ $t('property.detail.sizes.existing') }} {{ formatDecimal(scale?.floorAreaRatioExisting) }}%
                                <span v-if="scale?.floorAreaRatioPermitted"> ({{ $t('property.detail.sizes.permitted') }}: {{
                                        formatDecimal(scale?.floorAreaRatioPermitted) }}%)</span>
                        </div>
                </li>

                <li class="flex items-center"
                        v-if="scale?.buildingCoverageRatioExisting && scale.buildingCoverageRatioExisting > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">{{ $t('property.detail.sizes.building_coverage') }} :
                        </div>
                        <div class="flex-1">
                                {{ $t('property.detail.sizes.existing') }} {{ formatDecimal(scale?.buildingCoverageRatioExisting) }}%
                                <span v-if="scale?.buildingCoverageRatioPermitted"> ({{ $t('property.detail.sizes.permitted') }}: {{
                                        formatDecimal(scale?.buildingCoverageRatioPermitted) }}%)</span>
                        </div>
                </li>
        </ul>
        </div>
        <div v-else class="py-10 text-center text-cbre-blue text-base italic">
                No sizes and measurements information available.
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormat } from '~/composables/useFormat';
import type { ScaleType } from '~/types/property.type';

const props = defineProps<{
        scale: ScaleType | null | undefined
}>();

const hasData = computed(() => {
    return !!(props.scale && (
        (props.scale.gfaSqm && props.scale.gfaSqm > 0) ||
        (props.scale.nfaSqm && props.scale.nfaSqm > 0) ||
        (props.scale.siteAreaSqm && props.scale.siteAreaSqm > 0) ||
        (props.scale.floorPlateSqm && props.scale.floorPlateSqm > 0) ||
        (props.scale.floorAreaRatioExisting && props.scale.floorAreaRatioExisting > 0) ||
        (props.scale.buildingCoverageRatioExisting && props.scale.buildingCoverageRatioExisting > 0)
    ));
});

const { numberFormat } = useFormat();
const formatDecimal = (val: any) => numberFormat(val, 2);
</script>

