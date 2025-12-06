<template>
    <NuxtLayout name="default">
        <TypographyDemo />
    </NuxtLayout>
</template>

<script setup lang="ts">
import TypographyDemo from '~/components/demo/TypographyDemo.vue';


definePageMeta({
    layout: false
})
</script>
