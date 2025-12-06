<template>
    <NuxtLayout name="empty-layout">
        <TypographyDemo />
    </NuxtLayout>
</template>

<script setup lang="ts">
import TypographyDemo from '~/components/demo/TypographyDemo.vue';

definePageMeta({
    layout: 'empty-layout'
})
</script>
