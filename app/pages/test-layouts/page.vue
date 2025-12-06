<template>
    <NuxtLayout name="page-layout">
        <TypographyDemo />
    </NuxtLayout>
</template>

<script setup lang="ts">
import TypographyDemo from '~/components/demo/TypographyDemo.vue';


definePageMeta({
    layout: false
})
</script>
