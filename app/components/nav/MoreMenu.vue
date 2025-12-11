<template>
        <div class="flex w-full h-full pb-10">
                <div class="w-3/12 flex flex-col justify-start items-start pl-14">
                        <p class="text-4xl 4xs:text-6xl font-financier pt-16 mb-0">{{ $t('nav.more.title') }}</p>
                        <p class="text-2xl 4xs:text-4xl font-financier pt-1 mb-5">{{ $t('nav.more.filters') }}</p>
                        <p class="hidden 4xs:flex text-normal font-financier text-cbre-green">
                                {{ $t('nav.more.desc') }}
                        </p>
                </div>

                <ul
                        class="w-9/12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-start items-start pt-16 pl-14 pr-4">
                        <!-- Size -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-cbre-green-500 border-b border-cbre-green/25 pb-4 hover:border-cbre-green relative">
                                        {{ $t('nav.more.size') }}
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.gfa') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.gfa" :min="0" :max="100000"
                                                                :step="100" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{
                                                                thoundsGfa(moreFilters.gfa) }}</div>
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px] cursor-pointer"
                                                                @click="moreFilters.gfaType = false"
                                                                :class="{ 'font-bold': !moreFilters.gfaType }">py</span>
                                                        <USwitch v-model="moreFilters.gfaType" :ui="switchUi"
                                                                size="xs" />
                                                        <span class="pl-[3px] cursor-pointer"
                                                                @click="moreFilters.gfaType = true"
                                                                :class="{ 'font-bold': moreFilters.gfaType }">sqm</span>

                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.nfa') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.nfa" :min="0" :max="100000"
                                                                :step="100" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{
                                                                thoundsNfa(moreFilters.nfa) }}</div>
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px] cursor-pointer"
                                                                @click="moreFilters.nfaType = false"
                                                                :class="{ 'font-bold': !moreFilters.nfaType }">py</span>
                                                        <USwitch v-model="moreFilters.nfaType" :ui="switchUi"
                                                                size="xs" />
                                                        <span class="pl-[3px] cursor-pointer"
                                                                @click="moreFilters.nfaType = true"
                                                                :class="{ 'font-bold': moreFilters.nfaType }">sqm</span>

                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.site_area') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.siteArea" :min="0" :max="100000"
                                                                :step="100" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{
                                                                thoundsSite(moreFilters.siteArea) }}</div>
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px] cursor-pointer"
                                                                @click="moreFilters.siteAreaType = false"
                                                                :class="{ 'font-bold': !moreFilters.siteAreaType }">py</span>
                                                        <USwitch v-model="moreFilters.siteAreaType" :ui="switchUi"
                                                                size="xs" />
                                                        <span class="pl-[3px] cursor-pointer"
                                                                @click="moreFilters.siteAreaType = true"
                                                                :class="{ 'font-bold': moreFilters.siteAreaType }">sqm</span>

                                                </div>
                                        </div>
                                </div>
                        </li>
                        <!-- Period -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-cbre-green-500 border-b border-cbre-green/25 pb-4 hover:border-cbre-green relative">
                                        {{ $t('nav.more.period') }}
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.built') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.built" :min="1960"
                                                                :max="currentYear" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.built }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('built')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.reno') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.reno" :min="1960"
                                                                :max="currentYear" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.reno }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('reno')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.sales') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.sales" :min="1960"
                                                                :max="currentYear" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.sales }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('sales')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.leases') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.leases" :min="1960"
                                                                :max="currentYear" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.leases }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('leases')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <!-- Facility -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-cbre-green-500 border-b border-cbre-green/25 pb-4 hover:border-cbre-green relative">
                                        {{ $t('nav.more.facility') }}
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.buildings') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.buildings" :min="0" :max="10"
                                                                :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.buildings }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('buildings')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.basement') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.basement" :min="0" :max="10"
                                                                :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.basement }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('basement')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.upper_floor') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.upperFloor" :min="0" :max="50"
                                                                :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.upperFloor
                                                                }}</div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('upperFloor')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.elevator') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.elevator" :min="0" :max="20"
                                                                :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.elevator }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('elevator')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.parking') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.parking" :min="0" :max="500"
                                                                :step="10" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.parking }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('parking')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <!-- Finance -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-cbre-green-500 border-b border-cbre-green/25 pb-4 hover:border-cbre-green relative">
                                        {{ $t('nav.more.finance') }}
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.iod') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.iod" :min="0" :max="10"
                                                                :step="0.1" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.iod }}</div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('iod')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.gdm') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.gdm" :min="0" :max="10"
                                                                :step="0.1" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.gdm }}</div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('gdm')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.noc') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.noc" :min="0" :max="100000"
                                                                :step="1000" :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.noc }}</div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('noc')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">{{ $t('nav.more.eff_ratio') }}</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <USlider v-model="moreFilters.effRatio" :min="0" :max="100"
                                                                :ui="sliderUi" size="xs" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.effRatio }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('effRatio')"
                                                                class="rounded-none text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">{{
                                                                $t('nav.more.reset') }}</button>
                                                </div>
                                        </div>
                                </div>
                        </li>
                </ul>
        </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from "pinia";
import { usePropertyStore } from '~/stores/property';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const { moreFilters } = storeToRefs(propertyStore);

const { numberFormat } = useFormat();
const currentYear = computed(() => new Date().getFullYear());

// Custom UI Config for Sliders (Thinner track)
const sliderUi = { track: 'h-[1px] bg-gray-200', range: 'h-[1px] bg-cbre-green-500', thumb: 'ring-0 !w-3 !h-3 bg-cbre-green-500' }

// Custom UI Config for Switches (Match Slider Design)
const switchUi = {
        base: 'h-[1px] w-10 rounded-none border-0 ring-0 transition-transform',
        thumb: 'ring-0 !w-2 !h-2 bg-cbre-green-400 data-[state=checked]:!translate-x-8',
}

// Watch for changes and apply filter
watch(moreFilters, () => {
        propertyStore.applyFilter();
}, { deep: true });

// Formatting functions
const formatValue = (value: number, type: boolean) => {
        const unit = type ? ' ㎡' : ' py';
        return numberFormat(value, 0) + unit;
};

const thoundsGfa = (value: number) => formatValue(value, moreFilters.value.gfaType);
const thoundsNfa = (value: number) => formatValue(value, moreFilters.value.nfaType);
const thoundsSite = (value: number) => formatValue(value, moreFilters.value.siteAreaType);

// Reset function
// Reset function
const resetFilter = (key: string) => {
        if (moreFilters.value) {
                (moreFilters.value as any)[key] = 0;
        }
};
</script>
