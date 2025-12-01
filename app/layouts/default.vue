<template>
        <div id="DefaultLayout" class="bg-gray-100 min-h-screen font-sans text-cbre-slate">
                <NavTopBar />
                <main class="relative pt-[80px]">
                        <slot />
                </main>
        </div>
</template>

<script setup lang="ts">
// NavTopBar will be auto-imported
</script>

<style scoped>
/* Global styles are handled in main.css */
</style>