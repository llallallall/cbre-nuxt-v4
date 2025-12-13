<template>
        <h3 class="cbre-text-display-2 mb-6 border-b-2 border-cbre-green/10 pb-2 inline-block">{{ $t('property.detail.history.title') }}</h3>

        <div v-if="hasHistory" class="ml-3 my-4 border-l border-gray-200 space-y-8 relative">
                <div v-for="(h, index) in history" :key="h.id || index" 
                class="relative pl-8 transition-all duration-700 ease-out transform"
                :class="showTimeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                :style="{ transitionDelay: `${index * 150}ms` }">
                        <!-- Dot -->
                        <span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-cbre-green ring-4 ring-white"></span>
                        
                        <!-- Content -->
                         <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <span class="text-xl font-bold text-cbre-green font-calibre">{{ h.year }}</span>
                                <span class="text-sm text-gray-500 font-calibre uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded self-start sm:self-auto">
                                        {{ h.type === 'COMPLETION' ? $t('property.detail.history.completion') : $t('property.detail.history.renovation') }}
                                </span>
                         </div>
                </div>
        </div>
<div v-else class="py-10 text-center text-cbre-blue text-base italic">No history information available.</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { HistoryType } from '~/types/property.type';

const props = defineProps<{
        history: HistoryType[] | null | undefined;
}>();

const hasHistory = computed(() => {
        return props.history && props.history.length > 0 && props.history[0]?.year;
});

const showTimeline = ref(false);

onMounted(() => {
    setTimeout(() => {
        showTimeline.value = true;
    }, 100);
});
</script>

