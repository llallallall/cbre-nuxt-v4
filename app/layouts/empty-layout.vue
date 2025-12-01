<template>
        <div class="bg-cbre-dark w-screen h-screen overflow-hidden min-w-[360px] font-sans">
                <div class="container_wrapper">
                        <div class="flex w-full h-[65%] relative overflow-hidden">
                                <div class="bg-cbre-dark/60 absolute w-full h-full z-10"></div>
                                <div class="bg-image-01"></div>
                                <div class="bg-image-02"></div>
                        </div>
                        <div class="bg-footer"></div>
                </div>

                <div class="relative w-screen h-screen z-20">
                        <slot />
                </div>
        </div>
</template>

<style scoped>
@import '~/assets/css/layouts/empty.css';
</style>
