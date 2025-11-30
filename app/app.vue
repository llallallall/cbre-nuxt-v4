<template>
    <UApp :locale="locales[locale]">
        <NuxtLoadingIndicator color="#003F2D" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>

<style scoped>
/* Nuxt UI가 Tailwind 기반이므로 별도 CSS는 최소화합니다. */
</style>
