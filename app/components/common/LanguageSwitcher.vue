<template>
    <button @click="toggleLocale"
        class="flex items-center gap-1 focus:outline-none group opacity-80 hover:opacity-100 transition-opacity w-9 h-6 p-0"
        title="Switch Language">
        <IconFlagUS v-if="locale === 'en'" class="w-full h-full shadow-sm" />
        <IconFlagKR v-if="locale === 'ko'" class="w-full h-full shadow-sm" />
        <span class="text-xs font-semibold uppercase hidden" :class="isLightMode ? 'text-cbre-green' : 'text-white'">
            {{ locale }}
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '~/stores/ui'
const { locale, setLocale } = useI18n()
const uiStore = useUiStore()

const isLightMode = computed(() => uiStore.isLightMode)

const toggleLocale = () => {
    setLocale(locale.value === 'en' ? 'ko' : 'en')
}
</script>
