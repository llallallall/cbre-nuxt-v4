<template>
        <div class="font-financier text-2xl text-cbre-green mb-2">Sizes and Measurements Information</div>
        <ul
                class="cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-y-2">

                <li class="flex items-center" v-if="scale?.gfaSqm && scale.gfaSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">GFA :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.gfaSqm) }} ㎡ ({{ formatDecimal(scale?.gfaPy) }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="scale?.nfaSqm && scale.nfaSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">NFA :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.nfaSqm) }} ㎡ ({{ formatDecimal(scale?.nfaPy) }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="scale?.siteAreaSqm && scale.siteAreaSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Land Area :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.siteAreaSqm) }} ㎡ ({{ formatDecimal(scale?.siteAreaPy)
                                }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="scale?.floorPlateSqm && scale.floorPlateSqm > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Floor Plate :</div>
                        <div class="flex-1">
                                {{ formatDecimal(scale?.floorPlateSqm) }} ㎡ ({{
                                        formatDecimal(scale?.floorPlatePy) }} py)
                        </div>
                </li>

        </ul>

        <ul class="cbre_bulletList font-calibreLight text-lg text-cbre-green grid grid-cols-1 mt-2 gap-y-2">
                <li class="flex items-center" v-if="scale?.floorAreaRatioExisting && scale.floorAreaRatioExisting > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Floor Area Ratio :
                        </div>
                        <div class="flex-1">
                                Existing {{ formatDecimal(scale?.floorAreaRatioExisting) }}%
                                <span v-if="scale?.floorAreaRatioPermitted"> (Permitted: {{
                                        formatDecimal(scale?.floorAreaRatioPermitted) }}%)</span>
                        </div>
                </li>

                <li class="flex items-center"
                        v-if="scale?.buildingCoverageRatioExisting && scale.buildingCoverageRatioExisting > 0">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Building Coverage :
                        </div>
                        <div class="flex-1">
                                Existing {{ formatDecimal(scale?.buildingCoverageRatioExisting) }}%
                                <span v-if="scale?.buildingCoverageRatioPermitted"> (Permitted: {{
                                        formatDecimal(scale?.buildingCoverageRatioPermitted) }}%)</span>
                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
import { useFormat } from '~/composables/useFormat';
import type { ScaleType } from '~/types/property.type';

const props = defineProps<{
        scale: ScaleType | null | undefined
}>();

const { numberFormat } = useFormat();
const formatDecimal = (val: any) => numberFormat(val, 2);
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>