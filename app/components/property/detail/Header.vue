<template>
    <div class="w-full flex flex-col gap-2 mb-5">
        <div class="flex items-center gap-2">
            <div v-if="item?.sector"
                class="px-3 py-1 bg-cbre-green/10 text-cbre-green text-sm font-medium rounded-full">
                {{ item.sector.name }}
            </div>
            <div v-if="item?.subsector" class="px-3 py-1 bg-cbre-green/10 text-cbre-green text-sm font-medium rounded-full">
                {{ item.subsector.name }}
            </div>
            <div v-if="item?.profitability?.grade"
                class="px-3 py-1 bg-cbre-green/10 text-cbre-green text-sm font-medium rounded-full">
                Grade {{ item.profitability.grade }}
            </div>
        </div>
        <h1 class="cbre-text-display-1 text-cbre-green">{{ item?.name }}</h1>
    </div>
</template>

<script setup lang="ts">
import type { PropertyType } from '~/types/property.type';

defineProps<{
    item: PropertyType | null | undefined;
}>();
</script>
