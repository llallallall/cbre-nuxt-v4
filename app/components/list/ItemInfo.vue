<template>
        <div class="flex w-full h-full text-base leading-tight" :class="uiStore.isGridView ? 'flex-col ' : 'flex-row '">
                <div class="flex w-full justify-between" :class="uiStore.isGridView ? 'flex-row ' : ' flex-col'">
                        <div class="font-financierSemibold" :class="textClass">
                                GFA :
                        </div>
                        <div :class="uiStore.isGridView ? 'text-right ' : 'text-left'" class="whitespace-nowrap">
                                {{ numberFormat(item.scale?.gfaSqm, 2) }} m<sup>2</sup>
                        </div>
                </div>

                <div class="flex w-full justify-between" :class="uiStore.isGridView ? 'flex-row ' : ' flex-col'">
                        <div class="font-financierSemibold" :class="textClass">
                                NFA :
                        </div>
                        <div :class="uiStore.isGridView ? 'text-right ' : 'text-left'" class="whitespace-nowrap">
                                {{ numberFormat(item.scale?.nfaSqm, 2) }} m<sup>2</sup>
                        </div>
                </div>

                <div class="flex w-full justify-between" :class="uiStore.isGridView ? 'flex-row ' : ' flex-col'">
                        <div class="font-financierSemibold" :class="textClass">
                                Site Area :
                        </div>
                        <div :class="uiStore.isGridView ? 'text-right ' : 'text-left'" class="whitespace-nowrap">
                                {{ numberFormat(item.scale?.siteAreaSqm, 2) }} m<sup>2</sup>
                        </div>
                </div>

                <div class="flex w-full justify-between" :class="uiStore.isGridView ? 'flex-row ' : ' flex-col'">
                        <div class="flex-auto font-financierSemibold" :class="textClass">
                                YR. BLT / RENO :
                        </div>
                        <div :class="uiStore.isGridView ? 'text-right ' : 'text-left'"
                                class="flex-none whitespace-nowrap">
                                {{ getCompletionYear(item) }} / {{ getRenovationYear(item) }}
                        </div>
                </div>

                <div class="flex w-full justify-between" :class="uiStore.isGridView ? 'flex-row ' : ' flex-col'">
                        <div class="flex-auto font-financierSemibold" :class="textClass">
                                CONFIGURATION :
                        </div>
                        <div :class="uiStore.isGridView ? 'text-right ' : 'text-left'"
                                class="flex-none whitespace-nowrap">
                                {{ formatConfiguration(item) }}
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormat } from '~/composables/useFormat';
import type { PropertyType } from '~/types/property.type';
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore();

const { numberFormat } = useFormat();

const props = defineProps<{
        item: PropertyType
}>();

const textClass = computed(() => 'text-ellipsis overflow-hidden whitespace-nowrap');

const getCompletionYear = (item: PropertyType) => {
        const h = item.history?.find(el => el.type === 'COMPLETION');
        return h?.year || 'N.A.';
};

const getRenovationYear = (item: PropertyType) => {
        const h = item.history?.find(el => el.type === 'RENOVATION');
        return h?.year || 'N.A.';
};

const formatConfiguration = (item: PropertyType) => {
        const b = item.scale?.basementLevels;
        const u = item.scale?.upperLevels;

        const basement = (b && b > 0) ? `B${b}F - ` : '';
        const upper = (u && u > 0) ? `${u}F` : 'N.A.';

        return `${basement}${upper}`;
};
</script>
