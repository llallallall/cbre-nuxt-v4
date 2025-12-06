<template>
    <UApp :locale="locales[locale]">
        <NuxtLoadingIndicator color="#003F2D" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>

        <ConfirmModal v-if="confirmStore.isOpen" :model-value="confirmStore.isOpen" :title="confirmStore.options.title"
            :message="confirmStore.options.message" :confirm-text="confirmStore.options.confirmText"
            :cancel-text="confirmStore.options.cancelText" @update:model-value="confirmStore.cancel"
            @confirm="confirmStore.confirm" @cancel="confirmStore.cancel" />

        <ViewerModal v-if="statusStore.isViewerOpen" />
        <ClientOnly>
            <SelectedInfoModal v-if="uiStore.showInfoModal" :show="uiStore.showInfoModal"
                :items="propertyStore.keptProperties" @close="uiStore.showInfoModal = false" />
        </ClientOnly>
    </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { useConfirmStore } from '~/stores/confirm';
import { useUiStore } from '~/stores/ui';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import ConfirmModal from '~/components/common/ConfirmModal.vue';
import ViewerModal from '~/components/common/ViewerModal.vue';
import SelectedInfoModal from '~/components/map/SelectedInfoModal.vue';

const { locale } = useI18n()
const confirmStore = useConfirmStore();
const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();

const detailCardPrintAreaRef = ref(null);
provide('detailCardPrintAreaRef', detailCardPrintAreaRef);

// Device State Initialization
const device = useDevice();
if (device) {
    uiStore.setDeviceState(device.isMobile, device.isTablet);
}
</script>

<style scoped>
/* Nuxt UI가 Tailwind 기반이므로 별도 CSS는 최소화합니다. */
</style>

<style>
/* Hide scrollbar globally */
body {
    overflow: hidden;
}

body::-webkit-scrollbar {
    display: none;
}
</style>
