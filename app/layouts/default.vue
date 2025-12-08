<template>
    <div id="DefaultLayout" class="bg-cbre-gray-50 min-h-screen font-sans text-cbre-slate relative z-0">
        <NavTopBar />
        <main class="cbre-layout-content-scroll">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
// NavTopBar will be auto-imported
</script>