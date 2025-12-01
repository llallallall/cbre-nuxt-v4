<template>
    <div class="bg-cbre-dark w-full h-screen overflow-hidden min-w-[360px] font-sans">
        <div class="container_wrapper">
            <div class="bg-slider">
                <div class="bg-slider-cover"></div>
                <div class="bg-image-01"></div>
                <div class="bg-image-02"></div>
                <div class="bg-image-03"></div>
                <div class="bg-image-04"></div>
            </div>
            <div class="bg-footer"></div>
        </div>
        <div class="login-form-wrapper">
            <slot />
        </div>
    </div>
</template>

<style scoped>
@import '~/assets/css/layouts/auth.css';
</style>
