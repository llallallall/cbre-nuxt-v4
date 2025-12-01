<template>
    <UApp :locale="locales[locale]">
        <NuxtLoadingIndicator color="#003F2D" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>

        <ConfirmModal :model-value="confirmStore.isOpen" :title="confirmStore.options.title"
            :message="confirmStore.options.message" :confirm-text="confirmStore.options.confirmText"
            :cancel-text="confirmStore.options.cancelText" @update:model-value="confirmStore.cancel"
            @confirm="confirmStore.confirm" @cancel="confirmStore.cancel" />

        <ViewerModal />
        <UserProfileModal />
        <SelectedInfoPanel :show="uiStore.showInfoModal" :items="propertyStore.keptProperties"
            @close="uiStore.showInfoModal = false" />
    </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { useConfirmStore } from '~/stores/confirm';
import { useUiStore } from '~/stores/ui';
import { usePropertyStore } from '~/stores/property';
import ConfirmModal from '~/components/common/ConfirmModal.vue';
import ViewerModal from '~/components/common/ViewerModal.vue';
import UserProfileModal from '~/components/common/UserProfileModal.vue';
import SelectedInfoPanel from '~/components/map/SelectedInfoPanel.vue';

const { locale } = useI18n()
const confirmStore = useConfirmStore();
const uiStore = useUiStore();
const propertyStore = usePropertyStore();
</script>

<style scoped>
/* Nuxt UI가 Tailwind 기반이므로 별도 CSS는 최소화합니다. */
</style>
