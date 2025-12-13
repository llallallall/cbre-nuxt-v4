<template>
        <h3 class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">{{ $t('nav.anchor.parking') }}</h3>
        <ul v-if="hasData" class="cbre_bulletList font-calibreLight cbre-text-body-lg text-cbre-green grid grid-cols-1 md:grid-cols-2 gap-4">

                <li v-if="(facility?.cpsExisting !== null) || (facility?.cpsRequired !== null)"
                        class="flex items-center col-span-full">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.parking.capacity') }} :
                        </div>
                        <div class="flex-1">
                                <span v-if="facility?.cpsExisting !== null">
                                        {{ formatInt(facility?.cpsExisting) }} {{ $t('property.detail.parking.units') }}
                                </span>
                                <span v-if="facility?.cpsRequired !== null">
                                        ({{ $t('property.detail.parking.required') }} {{ formatInt(facility?.cpsRequired) }} {{ $t('property.detail.parking.units') }})
                                </span>
                        </div>
                </li>

                <li v-if="(facility?.freeCpsSqm !== null) || (facility?.freeCpsPy !== null)"
                        class="flex items-center col-span-full">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.parking.free_parking') }} :
                        </div>
                        <div class="flex-1">
                                <span v-if="facility?.freeCpsSqm !== null">
                                        {{ formatDecimal(facility?.freeCpsSqm) }} {{ $t('property.detail.parking.units_sqm') }}
                                </span>
                                <span v-if="facility?.freeCpsPy !== null">
                                        ({{ formatDecimal(facility?.freeCpsPy) }} {{ $t('property.detail.parking.units_py') }})
                                </span>
                        </div>
                </li>

                <li v-if="facility?.paidParkingFee !== null" class="flex items-center col-span-full">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.parking.paid_parking_fee') }} :
                        </div>
                        <div class="flex-1">
                                <span>KRW {{ formatInt(facility?.paidParkingFee) }} /unit ({{ $t('property.detail.parking.vat_included') }})</span>
                        </div>
                </li>
        </ul>
        <div v-else class="py-10 text-center text-cbre-blue text-base italic">
                No parking information available.
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormat } from '~/composables/useFormat';
import type { FacilityType } from '~/types/property.type';

const props = defineProps<{
        facility: FacilityType | null | undefined
}>();

const hasData = computed(() => {
    if (!props.facility) return false;
    return (props.facility.cpsExisting !== null && props.facility.cpsExisting !== undefined) ||
           (props.facility.cpsRequired !== null && props.facility.cpsRequired !== undefined) ||
           (props.facility.freeCpsSqm !== null && props.facility.freeCpsSqm !== undefined) ||
           (props.facility.freeCpsPy !== null && props.facility.freeCpsPy !== undefined) ||
           (props.facility.paidParkingFee !== null && props.facility.paidParkingFee !== undefined);
});

const { numberFormat } = useFormat();
const formatInt = (val: any) => numberFormat(val, 0);
const formatDecimal = (val: any) => numberFormat(val, 2);
</script>

