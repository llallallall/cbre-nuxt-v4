<template>
    <UApp :locale="locales[locale]" :toaster="{ position: 'top-right' }">
        <NuxtLoadingIndicator color="var(--eds-color-accent)" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>

        <CommonGlobalLoader />

        <CommonConfirmModal v-if="confirmStore.isOpen" :model-value="confirmStore.isOpen"
            :title="confirmStore.options.title" :message="confirmStore.options.message"
            :confirm-text="confirmStore.options.confirmText" :cancel-text="confirmStore.options.cancelText"
            @update:model-value="confirmStore.cancel" @confirm="confirmStore.confirm" @cancel="confirmStore.cancel" />

        <CommonViewerModal v-if="statusStore.isViewerOpen" />

        <CommonCarouselModal v-if="statusStore.isSlideOpen" />

        <ClientOnly>
                <MapSelectedInfoModal v-if="uiStore.showInfoModal" :show="uiStore.showInfoModal"
                :items="propertyStore.keptProperties" @close="uiStore.showInfoModal = false" />
        </ClientOnly>

        <CommonDocsModal v-if="uiStore.showDocsModal" />
    </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { useConfirmStore } from '~/stores/confirm';
import { useUiStore } from '~/stores/ui';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';

const { locale } = useI18n()
const confirmStore = useConfirmStore();
const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const indicator = useLoadingIndicator();

watch(() => statusStore.isGlobalLoading, (newVal) => {
    if (newVal) {
        indicator.start();
    } else {
        indicator.finish();
    }
});

const detailCardPrintAreaRef = ref(null);
provide('detailCardPrintAreaRef', detailCardPrintAreaRef);

// Device State Initialization
const device = useDevice();
if (device) {
    uiStore.setDeviceState(device.isMobile, device.isTablet);
}

// Sync HTML lang attribute with current locale for CSS :lang() selectors
useHead({
    title: 'CBRE Korea - Property Management System',
    htmlAttrs: {
        lang: locale
    }
})


</script>
