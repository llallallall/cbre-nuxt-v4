<template>
        <h3 class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">{{ $t('nav.anchor.facility') }}</h3>
        <ul v-if="hasData" class="cbre_bulletList font-calibreLight cbre-text-body-lg text-cbre-green grid grid-cols-1 gap-y-2">

                <li v-if="facility?.elevatorsTotal && facility.elevatorsTotal > 0" class="flex items-center ">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.facility.elevators') }} :
                        </div>
                        <div class="flex-1 text-base">
                                <span class="font-semibold">{{ facility?.elevatorsTotal }}</span>
                                <span v-if="facility?.elevatorsTotal && facility.elevatorsTotal > 0"
                                        class="text-cbre-green ml-2">
                                        (
                                        <span v-if="facility?.elevatorsPassenger">{{
                                                facility?.elevatorsPassenger }} {{ $t('property.detail.facility.passenger') }}</span>
                                        <span v-if="facility?.elevatorsService"> / {{ facility?.elevatorsService
                                                }} {{ $t('property.detail.facility.service') }}</span>
                                        <span v-if="facility?.elevatorsFreight"> / {{ facility?.elevatorsFreight
                                                }} {{ $t('property.detail.facility.freight') }}</span>
                                        )
                                </span>
                        </div>
                </li>
                <li v-if="facility?.facade" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.facility.facade') }} :
                        </div>
                        <div class="flex-1">
                                {{ facility?.facade }}
                        </div>
                </li>

                <li v-if="facility?.roofMaterial" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.facility.roof_material') }} :
                        </div>
                        <div class="flex-1">
                                {{ facility?.roofMaterial }}
                        </div>
                </li>

                <li v-if="facility?.lighting" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.facility.lighting') }} :
                        </div>
                        <div class="flex-1">
                                {{ facility?.lighting }}
                        </div>
                </li>

                <li v-if="facility?.mechanicalElectrical" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.facility.me') }} :
                        </div>
                        <div class="flex-1">
                                {{ thousandsFormat(facility?.mechanicalElectrical) }} kW
                        </div>
                </li>

                <li v-if="facility?.fireFighting" class="flex items-center">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1 text-cbre-green" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                {{ $t('property.detail.facility.fire_fighting') }} :
                        </div>
                        <div class="flex-1">
                                {{ facility?.fireFighting }}
                        </div>
                </li>

        </ul>
        <div v-else class="py-10 text-center text-cbre-blue text-base italic">
                No facility information available.
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
    return !!(props.facility && (
        (props.facility.elevatorsTotal && props.facility.elevatorsTotal > 0) ||
        props.facility.facade ||
        props.facility.roofMaterial ||
        props.facility.lighting ||
        props.facility.mechanicalElectrical ||
        props.facility.fireFighting
    ));
});

const { numberFormat } = useFormat();
const thousandsFormat = (val: any) => numberFormat(val, 0);
</script>

