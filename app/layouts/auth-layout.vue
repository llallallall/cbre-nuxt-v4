<template>
    <div class="cbre-layout-bg-wrapper font-sans">
        <div class="cbre-layout-auth-slider">
            <!-- Images (Order is important for :nth-child in CSS) -->
            <div class="cbre-layout-bg-image"></div>
            <div class="cbre-layout-bg-image"></div>
            <div class="cbre-layout-bg-image"></div>
            <div class="cbre-layout-bg-image"></div>

            <!-- Cover Overlay -->
            <div class="cbre-layout-auth-slider-cover"></div>
        </div>

        <div class="cbre-layout-auth-form-wrapper">
            <slot />
        </div>
    </div>
</template>

<style scoped>
/* Scoped styles replaced by main.css utility classes */
</style>
