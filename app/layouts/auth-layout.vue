<template>
    <div class="bg-cbre-green w-full h-screen overflow-hidden min-w-[320px] font-sans flex relative">
        <!-- Background Slider (Desktop Only) -->
        <div class="hidden lg:block absolute inset-0 w-full h-full z-0">
            <div class="bg-slider w-full h-full relative">
                <div class="bg-slider-cover absolute inset-0 bg-black/30 z-10"></div>
                <!-- Background Images (Managed by CSS animation) -->
                <div class="bg-image-common bg-image-01 absolute inset-0 bg-cover bg-center"></div>
                <div class="bg-image-common bg-image-02 absolute inset-0 bg-cover bg-center"></div>
                <div class="bg-image-common bg-image-03 absolute inset-0 bg-cover bg-center"></div>
                <div class="bg-image-common bg-image-04 absolute inset-0 bg-cover bg-center"></div>
            </div>
        </div>

        <!-- Login Form Container -->
        <div class="relative z-10 w-full h-full flex items-center justify-center lg:justify-end p-4 lg:p-20">
            <div class="w-full max-w-[480px] bg-white shadow-2xl rounded-lg overflow-hidden">
                <slot />
            </div>
        </div>

        <!-- Footer (Optional) -->
        <div class="absolute bottom-4 left-4 text-white/50 text-xs z-10 hidden lg:block">
            &copy; {{ new Date().getFullYear() }} CBRE Korea. All rights reserved.
        </div>
    </div>
</template>

<style scoped>
@import '~/assets/css/layouts/auth.css';

/* Ensure background images are handled correctly if not using the imported CSS for everything */
.bg-image-common {
    opacity: 0;
    animation: slideShow 24s infinite;
}

.bg-image-01 {
    background-image: url('/images/login/bg_01.jpg');
    animation-delay: 0s;
}

.bg-image-02 {
    background-image: url('/images/login/bg_02.jpg');
    animation-delay: 6s;
}

.bg-image-03 {
    background-image: url('/images/login/bg_03.jpg');
    animation-delay: 12s;
}

.bg-image-04 {
    background-image: url('/images/login/bg_04.jpg');
    animation-delay: 18s;
}

@keyframes slideShow {
    0% {
        opacity: 0;
        transform: scale(1);
    }

    4% {
        opacity: 1;
        transform: scale(1);
    }

    24% {
        opacity: 1;
        transform: scale(1.05);
    }

    28% {
        opacity: 0;
        transform: scale(1.05);
    }

    100% {
        opacity: 0;
        transform: scale(1);
    }
}
</style>