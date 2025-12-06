<template>
    <div class="bg-white min-h-screen pb-32 font-sans">
        <!-- Main Container -->
        <main class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-20">

            <!-- 1. Header Meta -->
            <div class="mb-4">
                <span class="text-cbre-green font-bold text-sm tracking-wide">
                    Insights & Research
                </span>
            </div>

            <!-- 2. Hero Title (Intelligent Investment) -->
            <h1 class="cbre-text-hero mb-8 text-cbre-green">
                Intelligent Investment
            </h1>

            <!-- 3. Social Icons (Mock) -->
            <div class="flex gap-4 mb-12 text-cbre-green">
                <UIcon name="i-heroicons-share" class="w-5 h-5" />
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
            </div>

            <!-- 4. Hero Image (Full Width) -->
            <div class="w-full h-[60vh] bg-gray-100 mb-16 relative overflow-hidden">
                <img src="https://placehold.co/1920x1080/E6EAEA/333333?text=Aerial+Property+View" alt="Hero Image"
                    class="w-full h-full object-cover" />
            </div>

            <!-- 5. Lead Section (Optimize your...) -->
            <div class="max-w-5xl">
                <p class="cbre-text-lead mb-6">
                    Optimize your real estate investment strategy with expert perspectives.
                    <span class="text-cbre-green opacity-70">Our research and insights platform combines comprehensive
                        data with in-depth capital markets expertise across geographies and property types.</span>
                </p>
            </div>

            <!-- 6. Divider -->
            <div class="w-full h-px bg-gray-200 my-16"></div>

            <!-- 7. Selected Articles (Grid mimicking the rest of the page usually) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <!-- Article Card 1 -->
                <div class="group cursor-pointer">
                    <div class="h-64 bg-gray-100 mb-6 overflow-hidden">
                        <img src="https://placehold.co/600x400/003F2D/FFFFFF?text=Report"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Report</span>
                    <h3 class="cbre-text-h2 text-cbre-green group-hover:underline decoration-2 underline-offset-4">
                        Global Real Estate Outlook 2024
                    </h3>
                </div>

                <!-- Article Card 2 -->
                <div class="group cursor-pointer">
                    <div class="h-64 bg-gray-100 mb-6 overflow-hidden">
                        <img src="https://placehold.co/600x400/17E88F/FFFFFF?text=Viewpoint"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Viewpoint</span>
                    <h3 class="cbre-text-h2 text-cbre-green group-hover:underline decoration-2 underline-offset-4">
                        European Logistics: The Road Ahead
                    </h3>
                </div>

                <!-- Article Card 3 -->
                <div class="group cursor-pointer">
                    <div class="h-64 bg-gray-100 mb-6 overflow-hidden">
                        <img src="https://placehold.co/600x400/333333/FFFFFF?text=Perspective"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <span
                        class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Perspective</span>
                    <h3 class="cbre-text-h2 text-cbre-green group-hover:underline decoration-2 underline-offset-4">
                        Sustainability as a Value Driver
                    </h3>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- SYSTEM REFERENCE CATALOG                       -->
            <!-- ============================================== -->
            <div class="mt-32 pt-16 border-t-2 border-gray-900">
                <h2 class="cbre-text-h2 mb-12 text-gray-400 uppercase tracking-widest text-sm font-bold">
                    Design System Reference
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <!-- Headings -->
                    <div>
                        <span class="cbre-text-label text-gray-400 block mb-6">Headings</span>
                        <div class="space-y-8">
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-hero</span>
                                <h1 class="cbre-text-hero">Hero Title</h1>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-h1</span>
                                <h1 class="cbre-text-h1">Heading Level 1</h1>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-h2</span>
                                <h2 class="cbre-text-h2">Heading Level 2</h2>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-h3</span>
                                <h3 class="cbre-text-h3">Heading Level 3</h3>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">h4 (Default)</span>
                                <h4>Heading Level 4 matches body sans</h4>
                            </div>
                        </div>
                    </div>

                    <!-- Body & Utilities -->
                    <div>
                        <span class="cbre-text-label text-gray-400 block mb-6">Body & Text</span>
                        <div class="space-y-8">
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-lead</span>
                                <p class="cbre-text-lead">
                                    Lead paragraph text used for article introductions.
                                </p>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-body-large</span>
                                <p class="cbre-text-body-large">
                                    Large body text used for emphasis or sub-introductions. Clean and readable
                                    Sans-Serif.
                                </p>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-body</span>
                                <p class="cbre-text-body">
                                    Standard body text. detailed information, long form content, and general
                                    readability.
                                </p>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-meta</span>
                                <p class="cbre-text-meta">
                                    Meta data like dates, authors, captions.
                                </p>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-text-label</span>
                                <p class="cbre-text-label">
                                    LABEL TAG
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Links -->
                    <div class="lg:col-span-2">
                        <span class="cbre-text-label text-gray-400 block mb-6">Links & Interactions</span>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-8">
                            <div>
                                <span class="text-xs text-gray-400 block mb-2">.cbre-link-animated-arrow</span>
                                <a href="#" class="cbre-link-animated-arrow">Explore Intelligent Investment</a>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-2">.cbre-link-fade-arrow</span>
                                <a href="#" class="cbre-link-fade-arrow">Read More</a>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-2">.cbre-link-underline-slide</span>
                                <a href="#" class="cbre-link-underline-slide">View Report</a>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-2">.cbre-link-large-serif</span>
                                <a href="#" class="cbre-link-large-serif">Global Market Outlook</a>
                            </div>
                        </div>
                    </div>

                    <!-- Components -->
                    <div class="lg:col-span-2">
                        <span class="cbre-text-label text-gray-400 block mb-6">Layout Utilities</span>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-quote</span>
                                <blockquote class="cbre-quote">
                                    <p class="cbre-text-h3 italic">
                                        "Pull quotes add emphasis and visual break to long articles."
                                    </p>
                                </blockquote>
                            </div>
                            <div>
                                <span class="text-xs text-gray-400 block mb-1">.cbre-list-brand</span>
                                <ul class="cbre-list-brand space-y-2">
                                    <li class="cbre-text-body">Brand Styled List Item 1</li>
                                    <li class="cbre-text-body">Brand Styled List Item 2</li>
                                    <li class="cbre-text-body">Brand Styled List Item 3</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
// TypographyDemo.vue - Replicating 'Intelligent Investment' Layout
</script>

<style scoped>
/* Scoped styles removed */
</style>
