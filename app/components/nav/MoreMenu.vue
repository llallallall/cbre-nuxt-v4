<template>
        <div class="flex w-full h-full">
                <div class="w-3/12 flex flex-col justify-start items-start pl-14">
                        <p class="text-4xl 4xs:text-6xl font-financier pt-16 mb-0">More</p>
                        <p class="text-2xl 4xs:text-4xl font-financier pt-1 mb-5">Filters</p>
                        <p class="hidden 4xs:flex text-base font-financier text-cbre-green">
                                You can set details such as the size of the property, the year of construction, and
                                facilities as search conditions.
                        </p>
                </div>

                <ul
                        class="w-9/12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-start items-start pt-16 pl-14 pr-4">
                        <!-- Size -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-cbre-green/25 pb-4 hover:border-cbre-green">
                                        Size
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">GFA</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.gfa" :min="0" :max="100000"
                                                                :step="100" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{
                                                                thoundsGfa(moreFilters.gfa) }}</div>
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px]">py</span>
                                                        <UToggle v-model="moreFilters.gfaType" color="cbre-green" />
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">NFA</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.nfa" :min="0" :max="100000"
                                                                :step="100" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{
                                                                thoundsNfa(moreFilters.nfa) }}</div>
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px]">py</span>
                                                        <UToggle v-model="moreFilters.nfaType" color="cbre-green" />
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">Site Area</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.siteArea" :min="0" :max="100000"
                                                                :step="100" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{
                                                                thoundsSite(moreFilters.siteArea) }}</div>
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px]">py</span>
                                                        <UToggle v-model="moreFilters.siteAreaType"
                                                                color="cbre-green" />
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <!-- Period -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-cbre-green/25 pb-4 hover:border-cbre-green">
                                        Period
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">Built</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.built" :min="1960"
                                                                :max="currentYear" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.built }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('built')"
                                                                class="rounded-md text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">Reno</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.reno" :min="1960"
                                                                :max="currentYear" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.reno }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('reno')"
                                                                class="rounded-md text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">Sales</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.sales" :min="1960"
                                                                :max="currentYear" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.sales }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('sales')"
                                                                class="rounded-md text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green relative">
                                                <div class="w-[100px]">Leases</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.leases" :min="1960"
                                                                :max="currentYear" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.leases }}
                                                        </div>
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('leases')"
                                                                class="rounded-md text-cbre-green bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <!-- Facility -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-cbre-green/25 pb-4 hover:border-cbre-green">
                                        Facility
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">Buildings</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.buildings" :min="0" :max="10"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.buildings }}
                                                        </div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">Basement</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.basement" :min="0" :max="10"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.basement }}
                                                        </div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">Upper Floor</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.upperFloor" :min="0" :max="50"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.upperFloor
                                                                }}</div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">Elevator</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.elevator" :min="0" :max="20"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.elevator }}
                                                        </div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">Parking</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.parking" :min="0" :max="500"
                                                                :step="10" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.parking }}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <!-- Finance -->
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-cbre-green/25 pb-4 hover:border-cbre-green">
                                        Finance
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-cbre-green">
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">IOD</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.iod" :min="0" :max="10" :step="0.1"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.iod }}</div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">GDM</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.gdm" :min="0" :max="10" :step="0.1"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.gdm }}</div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">NOC</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.noc" :min="0" :max="100000"
                                                                :step="1000" color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.noc }}</div>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-cbre-green/25 py-4 hover:border-cbre-green">
                                                <div class="w-[100px]">Eff. Ratio</div>
                                                <div class="flex-1 relative pt-3 px-2">
                                                        <URange v-model="moreFilters.effRatio" :min="0" :max="100"
                                                                color="cbre-green" />
                                                        <div class="text-xs text-right mt-1">{{ moreFilters.effRatio }}
                                                        </div>
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
const resetFilter = (key: 'built' | 'reno' | 'sales' | 'leases') => {
        if (moreFilters.value) {
                moreFilters.value[key] = 0;
        }
};
</script>
