<template>
    <div class="bg-white min-h-screen pb-32 font-sans">
        <!-- Main Container -->
        <main class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-20">

            <!-- 1. Header Meta -->
            <div class="mb-4">
                <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-label-sm</code>
                <span class="cbre-text-label-sm tracking-wide">
                    Insights & Research
                </span>
            </div>

            <!-- 2. Hero Title (Intelligent Investment) -->
            <div class="mb-8">
                <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-hero</code>
                <h1 class="cbre-text-display-hero text-cbre-green break-words">
                    Intelligent Investment
                </h1>
            </div>

            <!-- 3. Social Icons (Mock) -->
            <div class="flex gap-4 mb-12 text-cbre-green">
                <UIcon name="i-heroicons-share"
                    class="w-6 h-6 hover:text-cbre-accent cursor-pointer transition-colors" />
                <UIcon name="i-heroicons-envelope"
                    class="w-6 h-6 hover:text-cbre-accent cursor-pointer transition-colors" />
            </div>

            <!-- 4. Hero Image (Full Width) -->
            <div class="w-full h-[60vh] bg-gray-100 mb-16 relative overflow-hidden group">
                <div class="cbre-image-wrapper h-full w-full">
                    <img src="https://placehold.co/1920x1080/E6EAEA/333333?text=Aerial+Property+View" alt="Hero Image"
                        class="cbre-image" />
                    <div class="cbre-image-overlay"></div>
                </div>
            </div>

            <!-- 5. Lead Section (Optimize your...) -->
            <div class="max-w-6xl">
                <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-lead</code>
                <p class="cbre-text-body-lead mb-8">
                    Optimize your real estate investment strategy with expert perspectives.
                    <span class="text-cbre-green opacity-70">Our research and insights platform combines comprehensive
                        data with in-depth capital markets expertise across geographies and property types.</span>
                </p>
                <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-button-primary</code>
                <button class="cbre-button-primary">
                    Explore Intelligent Investment
                </button>
            </div>

            <!-- 6. Divider -->
            <div class="w-full h-px bg-gray-200 my-20"></div>

            <!-- 7. Selected Articles (Grid mimicking the rest of the page usually) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
                <!-- Article Card 1 -->
                <div class="group cursor-pointer">
                    <div class="h-64 bg-gray-100 mb-6 overflow-hidden cbre-image-wrapper">
                        <img src="https://placehold.co/600x400/003F2D/FFFFFF?text=Report"
                            class="cbre-image group-hover:scale-105" />
                        <div class="cbre-image-overlay"></div>
                    </div>
                    <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-label-sm</code>
                    <span class="cbre-text-label-sm mb-3 block text-gray-500">Report</span>
                    <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-2</code>
                    <h3
                        class="cbre-text-display-2 text-cbre-green group-hover:underline decoration-2 underline-offset-4">
                        Global Real Estate Outlook 2024
                    </h3>
                </div>

                <!-- Article Card 2 -->
                <div class="group cursor-pointer">
                    <div class="h-64 bg-gray-100 mb-6 overflow-hidden cbre-image-wrapper">
                        <img src="https://placehold.co/600x400/17E88F/FFFFFF?text=Viewpoint"
                            class="cbre-image group-hover:scale-105" />
                        <div class="cbre-image-overlay"></div>
                    </div>
                    <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-label-sm</code>
                    <span class="cbre-text-label-sm mb-3 block text-gray-500">Viewpoint</span>
                    <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-2</code>
                    <h3
                        class="cbre-text-display-2 text-cbre-green group-hover:underline decoration-2 underline-offset-4">
                        European Logistics: The Road Ahead
                    </h3>
                </div>

                <!-- Article Card 3 -->
                <div class="group cursor-pointer">
                    <div class="h-64 bg-gray-100 mb-6 overflow-hidden cbre-image-wrapper">
                        <img src="https://placehold.co/600x400/333333/FFFFFF?text=Perspective"
                            class="cbre-image group-hover:scale-105" />
                        <div class="cbre-image-overlay"></div>
                    </div>
                    <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-label-sm</code>
                    <span class="cbre-text-label-sm mb-3 block text-gray-500">Perspective</span>
                    <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-2</code>
                    <h3
                        class="cbre-text-display-2 text-cbre-green group-hover:underline decoration-2 underline-offset-4">
                        Sustainability as a Value Driver
                    </h3>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- UX FEATURES DEMO (Merged from SystemCheck)     -->
            <!-- ============================================== -->
            <section class="mb-32 pt-16 border-t-2 border-gray-900">
                <h2 class="cbre-text-display-2 mb-12 text-gray-400 uppercase tracking-widest text-sm font-bold">
                    UX Features Demo (Interactive)
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- 1. Toast Notifications -->
                    <div class="space-y-4">
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-3</code>
                        <h3 class="cbre-text-display-3 mb-4">1. Toast Notifications</h3>
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-md</code>
                        <p class="cbre-text-body-md text-gray-600 mb-4">Provides non-intrusive feedback.</p>
                        <div class="flex gap-2">
                            <UButton color="primary" variant="solid" class="rounded-none uppercase"
                                @click="showSuccessToast">
                                Success Toast
                            </UButton>
                            <UButton color="error" variant="outline" class="rounded-none uppercase"
                                @click="showErrorToast">
                                Error Toast
                            </UButton>
                        </div>
                    </div>

                    <!-- 2. Modal Dialog -->
                    <div class="space-y-4">
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-3</code>
                        <h3 class="cbre-text-display-3 mb-4">2. Modal Dialog</h3>
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-md</code>
                        <p class="cbre-text-body-md text-gray-600 mb-4">Focuses user attention.</p>
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-button-secondary</code>
                        <UButton variant="ghost" icon="i-heroicons-window" class="cbre-button-secondary rounded-none"
                            @click="isOpen = true">
                            Open Modal
                        </UButton>
                    </div>

                    <!-- 3. Loading States -->
                    <div class="space-y-4">
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-3</code>
                        <h3 class="cbre-text-display-3 mb-4">3. Loading States</h3>
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-md</code>
                        <p class="cbre-text-body-md text-gray-600 mb-4">Improves perceived performance.</p>
                        <div class="flex items-center gap-4">
                            <!-- 버튼 로딩 -->
                            <UButton :loading="isLoading" color="primary" variant="solid" class="rounded-none uppercase"
                                @click="simulateLoading">
                                Fetch Data (2s)
                            </UButton>
                        </div>
                        <!-- 스켈레톤 로딩 -->
                        <div v-if="isLoading" class="space-y-2 mt-4">
                            <USkeleton class="h-4 w-[250px]" />
                            <USkeleton class="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================== -->
            <!-- SEARCH PANEL DEMO (Standardized)               -->
            <!-- ============================================== -->
            <section class="mb-32 pt-16 border-t-2 border-gray-900">
                <h2 class="cbre-text-display-2 mb-12 text-gray-400 uppercase tracking-widest text-sm font-bold">
                    Standardized Search Panel UI
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Panel Structure Demo -->
                    <div class="bg-gray-100 p-8">
                        <div class="cbre-panel-container h-[500px] max-w-md mx-auto relative rounded-none">
                            <!-- Header -->
                            <div class="cbre-panel-header">
                                <h2 class="cbre-panel-title">Panel Title</h2>
                                <div class="cbre-input-search-box my-6">
                                    <div class="relative flex items-center w-full">
                                        <input type="text" class="cbre-input-search-field" placeholder="Search..." />
                                        <div class="cbre-input-search-icon-wrapper">
                                            <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <p class="cbre-panel-description">Standardized panel description text style.</p>
                            </div>
                            <!-- Body -->
                            <div class="flex-1 p-8 bg-white">
                                <p class="cbre-text-body-md">Panel Content Area</p>
                            </div>
                            <!-- Footer -->
                            <div class="cbre-panel-footer mt-auto">
                                <button class="cbre-button-action-danger group">
                                    <UIcon name="i-heroicons-trash"
                                        class="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span class="cbre-button-action-danger-text">Danger Action</span>
                                </button>
                                <button class="cbre-button-action-secondary group">
                                    <span class="cbre-button-action-secondary-text">Secondary</span>
                                    <UIcon name="i-heroicons-arrow-right"
                                        class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Usage Documentation -->
                    <div class="space-y-4">
                        <h3 class="cbre-text-display-3">Utility Classes</h3>
                        <ul class="space-y-2">
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-panel-container</code>
                                <span class="text-sm text-gray-600 ml-2">Main flex container</span>
                            </li>
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-panel-header</code>
                                <span class="text-sm text-gray-600 ml-2">Dark Green Header</span>
                            </li>
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-input-search-box</code>
                                <span class="text-sm text-gray-600 ml-2">Floating Search Input</span>
                            </li>
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-button-action-*</code>
                                <span class="text-sm text-gray-600 ml-2">Footer Actions</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- ============================================== -->
            <!-- SEARCH RESULT ITEMS DEMO (New Standard)        -->
            <!-- ============================================== -->
            <section class="mb-32 pt-16 border-t-2 border-gray-900">
                <h2 class="cbre-text-display-2 mb-12 text-gray-400 uppercase tracking-widest text-sm font-bold">
                    Search Result Items (Interactive)
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Demo Area -->
                    <div class="bg-gray-100 p-8 space-y-4">
                        <!-- Address Result -->
                        <div
                            class="cbre-panel-card mb-3 cursor-pointer group hover:border-cbre-green transition-colors !p-4">
                            <div class="flex justify-between items-center mb-2">
                                <div
                                    class="w-[calc(100%-40px)] cbre-text-body-md font-bold truncate group-hover:text-[var(--color-primary-1)]">
                                    Gangnam Finance Center
                                </div>
                                <div class="cbre-badge-circle cbre-badge-circle-yellow">
                                    A
                                </div>
                            </div>
                            <div class="cbre-text-meta flex flex-col gap-1">
                                <div class="flex items-center">
                                    <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                                    <span class="truncate">Seoul, Gangnam-gu, Teheran-ro 152</span>
                                </div>
                                <div class="flex items-center mt-1 opacity-70">
                                    <UIcon name="i-heroicons-map-pin" class="w-3 h-3 mr-1" />
                                    <span>37.5000, 127.0300</span>
                                </div>
                            </div>
                        </div>
                        <!-- Keyword Result -->
                        <div
                            class="cbre-panel-card mb-3 cursor-pointer group hover:border-cbre-green transition-colors !p-4">
                            <div class="flex justify-between items-center mb-2">
                                <div
                                    class="w-[calc(100%-40px)] cbre-text-body-md font-bold truncate group-hover:text-[var(--color-primary-1)]">
                                    Starbucks GFC
                                </div>
                                <div class="cbre-badge-circle cbre-badge-circle-yellow">
                                    K
                                </div>
                            </div>
                            <div class="cbre-text-meta flex flex-col gap-1">
                                <div class="flex items-center text-[var(--color-primary-1)] font-medium mb-0.5">
                                    Cafe / Coffee
                                </div>
                                <span class="truncate">Teheran-ro 152</span>
                            </div>
                        </div>
                        <!-- Google Result -->
                        <div
                            class="cbre-panel-card mb-3 cursor-pointer group hover:border-cbre-green transition-colors !p-4">
                            <div class="flex justify-between items-center mb-2">
                                <div
                                    class="w-[calc(100%-40px)] cbre-text-body-md font-bold truncate group-hover:text-[var(--color-primary-1)]">
                                    Seoul City Hall
                                </div>
                                <div class="cbre-badge-circle cbre-badge-circle-blue">
                                    G
                                </div>
                            </div>
                            <div class="cbre-text-meta flex flex-col gap-1">
                                <div class="flex items-center text-[var(--color-primary-1)] font-medium mb-0.5">
                                    City Hall
                                </div>
                                <span class="truncate">Sejong-daero 110</span>
                            </div>
                        </div>
                    </div>

                    <!-- Usage Documentation -->
                    <div class="space-y-4">
                        <h3 class="cbre-text-display-3">Component Classes</h3>
                        <ul class="space-y-2">
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-panel-card</code>
                                <span class="text-sm text-gray-600 ml-2">Standard Card (Wrapped)</span>
                            </li>
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-text-body-md</code>
                                <span class="text-sm text-gray-600 ml-2">Title Base (Bold + Truncate)</span>
                            </li>
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-text-meta</code>
                                <span class="text-sm text-gray-600 ml-2">Meta Info</span>
                            </li>
                            <li>
                                <code class="text-blue-500 font-bold">.cbre-badge-circle</code>
                                <span class="text-sm text-gray-600 ml-2">Icon Badge Base</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- ============================================== -->
            <!-- SYSTEM REFERENCE CATALOG                       -->
            <!-- ============================================== -->
            <div class="pt-16 border-t-2 border-gray-900">
                <h2 class="cbre-text-display-2 mb-12 text-gray-400 uppercase tracking-widest text-sm font-bold">
                    Design System Reference (Updated)
                </h2>
                <div class="mb-8">
                    <span class="text-xs font-bold text-gray-500 uppercase block mb-2">Brand & Primary (Green
                        Scale)</span>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <!-- Primary / Brand -->
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-green shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-green</code>
                            <span class="text-[10px] text-gray-500 block">Primary / Brand (#003F2D)</span>
                        </div>
                        <!-- Accent -->
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-accent shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-accent</code>
                            <span class="text-[10px] text-gray-500 block">Accent (#17E88F)</span>
                        </div>
                        <!-- Darkest Green -->
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-green-950 shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-green-950</code>
                            <span class="text-[10px] text-gray-500 block">Darkest</span>
                        </div>
                        <!-- Light Gray/Green -->
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-green-100 shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-green-100</code>
                            <span class="text-[10px] text-gray-500 block">Light Background</span>
                        </div>
                        <!-- Background White/Mint -->
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-green-50 shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-green-50</code>
                            <span class="text-[10px] text-gray-500 block">Faint Background</span>
                        </div>
                    </div>
                </div>

                <!-- Neutral / Slate Scale -->
                <div class="mb-8">
                    <span class="text-xs font-bold text-gray-500 uppercase block mb-2">Neutral (Slate
                        Scale)</span>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-slate shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-slate</code>
                            <span class="text-[10px] text-gray-500 block">Body Text</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-slate-light shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-slate-light</code>
                            <span class="text-[10px] text-gray-500 block">Meta Text</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-16 w-full bg-cbre-slate-lighter shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-slate-lighter</code>
                            <span class="text-[10px] text-gray-500 block">Borders / Dividers</span>
                        </div>
                    </div>
                </div>

                <!-- Secondary Colors -->
                <div class="mb-8">
                    <span class="text-xs font-bold text-gray-500 uppercase block mb-2">Secondary Palette</span>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-blue-dark shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-blue-dark</code>
                            <span class="text-[10px] text-gray-500 block">Dark Blue</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-blue shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-blue</code>
                            <span class="text-[10px] text-gray-500 block">Blue</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-teal shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-teal</code>
                            <span class="text-[10px] text-gray-500 block">Teal</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-yellow shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-yellow</code>
                            <span class="text-[10px] text-gray-500 block">Yellow</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-olive shadow-sm"></div>
                            <code class="font-[16px] block font-bold text-blue-600">.bg-cbre-olive</code>
                            <span class="text-[10px] text-gray-500 block">Olive</span>
                        </div>
                    </div>
                </div>


                <!-- Functional & Aliases -->
                <div class="mb-8">
                    <span class="text-xs font-bold text-gray-500 uppercase block mb-2">Functional & Aliases
                        (New)</span>
                    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-functional-error shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-functional-error</code>
                            <span class="text-[10px] text-gray-500 block">System 12</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-functional-warning shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-functional-warning</code>
                            <span class="text-[10px] text-gray-500 block">System 13</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-functional-info shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-functional-info</code>
                            <span class="text-[10px] text-gray-500 block">System 14</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-kakao shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-kakao</code>
                            <span class="text-[10px] text-gray-500 block">Kakao</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-tag shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-tag</code>
                            <span class="text-[10px] text-gray-500 block">Tag Blue</span>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-darkgreen shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-darkgreen</code>
                            <span class="text-[10px] text-gray-500 block">Dark Green</span>
                        </div>
                    </div>
                </div>

                <!-- Pastel Colors -->
                <div class="mb-8">
                    <span class="text-xs font-bold text-gray-500 uppercase block mb-2">Pastel Palette</span>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-pastel-blue shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-pastel-blue</code>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-pastel-gray shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-pastel-gray</code>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-pastel-mint shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-pastel-mint</code>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-pastel-cream shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-pastel-cream</code>
                        </div>
                        <div class="space-y-1">
                            <div class="h-12 w-full bg-cbre-pastel-green shadow-sm"></div>
                            <code class="text-lg block font-bold text-blue-600">.bg-cbre-pastel-green</code>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Font Families -->
            <div>
                <span class="cbre-text-label-sm block mb-6">Font Families</span>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Financier -->
                    <div class="p-6 border border-gray-200">
                        <h3 class="cbre-text-display-3 mb-2">Financier Display</h3>
                        <p class="text-sm text-gray-600 mb-4">Serif / Headings & Body</p>
                        <p class="font-serif text-3xl mb-2">Aa Bb Cc</p>
                        <p class="font-serif text-lg">The quick brown fox jumps over the lazy dog.</p>
                    </div>
                    <!-- Calibre -->
                    <div class="p-6 border border-gray-200">
                        <h3 class="cbre-text-display-3 mb-2 font-sans">Calibre</h3>
                        <p class="text-sm text-gray-600 mb-4">Sans-serif / UI & Labels</p>
                        <p class="font-sans text-3xl mb-2">Aa Bb Cc</p>
                        <p class="font-sans text-lg">The quick brown fox jumps over the lazy dog.</p>
                    </div>
                    <!-- Barlow Condensed -->
                    <div class="p-6 border border-gray-200">
                        <h3 class="cbre-text-display-3 mb-2 font-condensed">Barlow Condensed</h3>
                        <p class="text-sm text-gray-600 mb-4">Condensed / Data</p>
                        <p class="font-condensed text-3xl mb-2">1,234,567</p>
                        <p class="font-condensed text-lg">DATA VISUALIZATION</p>
                    </div>
                    <!-- Space Mono -->
                    <div class="p-6 border border-gray-200">
                        <h3 class="cbre-text-display-3 mb-2 cbre-font-mono">Space Mono</h3>
                        <p class="text-sm text-gray-600 mb-4">Monospace / Code & Tech</p>
                        <p class="cbre-font-mono text-3xl mb-2">101010</p>
                        <p class="cbre-font-mono text-lg">console.log('CBRE')</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <!-- Button Variants -->
                <div>
                    <span class="cbre-text-label-sm block mb-4">Button Variants</span>
                    <div class="flex flex-wrap gap-4 items-center">
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-primary</code>
                            <button class="cbre-button-primary">Primary Button</button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-secondary</code>
                            <button class="cbre-button-secondary">Secondary Button</button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-tertiary</code>
                            <button class="cbre-button-tertiary">
                                Tertiary Action
                                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
                            </button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-brief</code>
                            <button class="cbre-button-brief">
                                Brief Button
                            </button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-brief-sm</code>
                            <button class="cbre-button-brief-sm">
                                Brief SM
                            </button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-badge</code>
                            <button class="cbre-button-badge">
                                Badge Button
                            </button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-nav-circle</code>
                            <button class="cbre-button-nav-circle">
                                <UIcon name="i-heroicons-arrow-right" class="w-6 h-6" />
                            </button>
                        </div>
                        <div class="flex flex-col">
                            <code class="text-lg text-blue-500 font-mono mb-1">.cbre-button-topbar-menu</code>
                            <button class="cbre-button-topbar-menu">
                                Menu Button
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Link Interactions -->
                <div>
                    <span class="cbre-text-label-sm block mb-4">Link Interactions</span>
                    <div class="flex flex-col gap-4 items-start">
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-link-underline</code>
                            <a href="#" class="cbre-text-link-underline text-xl">Standard Underline
                                Animation</a>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-link-icon-slide</code>
                            <a href="#" class="cbre-text-link-icon-slide text-xl">Animated Icon Slide</a>
                        </div>
                        <div>
                            <code
                                class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-link-underline-slide</code>
                            <a href="#" class="cbre-text-link-underline-slide text-xl">Underline Slide
                                Effect</a>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-link-fade-arrow</code>
                            <a href="#" class="cbre-text-link-fade-arrow text-xl">Fade Arrow Link</a>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-link-large-serif</code>
                            <a href="#" class="cbre-text-link-large-serif">Large Serif Link Style</a>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-link-arrow</code>
                            <a href="#" class="cbre-text-link-arrow text-xl">
                                Simple Arrow Effect
                                <UIcon name="i-heroicons-arrow-right" class="icon w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Layout & Form Utilities -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <span class="cbre-text-label-sm block mb-4">Form Inputs</span>
                    <div class="space-y-4">
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-input</code>
                            <input type="text" class="cbre-input" placeholder="Standard Input Field" />
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-input (Disabled)</code>
                            <input type="text" class="cbre-input" disabled placeholder="Disabled Input" />
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-input-underlined</code>
                            <input type="text" class="cbre-input-underlined" placeholder="Underlined Input" />
                        </div>
                    </div>
                </div>
                <div>
                    <span class="cbre-text-label-sm block mb-4">Cards</span>
                    <div>
                        <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-panel-card</code>
                        <div class="cbre-panel-card">
                            <h4 class="cbre-text-display-3 mb-2">Card Title</h4>
                            <p class="cbre-text-body-md">This is a standard card container with hover effect.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-20 border-b-2 border-gray-100 mb-20">
                <!-- Headings -->
                <div>
                    <span class="cbre-text-label-sm text-gray-400 block mb-6">Headings</span>
                    <div class="space-y-8">
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-hero</code>
                            <h1 class="cbre-text-display-hero">Hero Title</h1>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-1</code>
                            <h1 class="cbre-text-display-1">Heading Level 1</h1>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-2</code>
                            <h2 class="cbre-text-display-2">Heading Level 2</h2>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-3</code>
                            <h3 class="cbre-text-display-3">Heading Level 3</h3>
                        </div>
                        <!-- Integrated Deep Dive Item -->
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-display-italic</code>
                            <p class="cbre-text-display-italic">
                                "Real estate is not just about buildings."
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Body & Utilities -->
                <div>
                    <span class="cbre-text-label-sm text-gray-400 block mb-6">Body & Text</span>
                    <div class="space-y-8">
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-lead</code>
                            <p class="cbre-text-body-lead">
                                Lead paragraph text used for article introductions.
                            </p>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-lg</code>
                            <p class="cbre-text-body-lg">
                                Large body text used for emphasis or sub-introductions. Clean and readable
                                Sans-Serif.
                            </p>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-body-md</code>
                            <p class="cbre-text-body-md">
                                Standard body text. detailed information, long form content, and general
                                readability.
                            </p>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-meta</code>
                            <p class="cbre-text-meta">
                                Meta data like dates, authors, captions.
                            </p>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-label-sm</code>
                            <p class="cbre-text-label-sm">
                                LABEL TAG
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Deep Dive Additions: Stats & Footer -->
            <div class="space-y-20">
                <!-- Layout Utilities -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <span class="cbre-text-label-sm text-gray-400 block mb-6">Quotes</span>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-quote</code>
                            <blockquote class="cbre-text-quote">
                                <p class="cbre-text-display-3 italic">
                                    "Pull quotes add emphasis and visual break to long articles."
                                </p>
                            </blockquote>
                        </div>
                    </div>
                    <div>
                        <span class="cbre-text-label-sm text-gray-400 block mb-6">Lists & Layouts</span>
                        <div>
                            <h5 class="cbre-text-display-3 mb-2">Lists</h5>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-list-brand</code>
                            <ul class="cbre-list-brand space-y-2 mb-8">
                                <li class="cbre-text-body-md">Brand Styled List Item 1</li>
                                <li class="cbre-text-body-md">Brand Styled List Item 2</li>
                                <li class="cbre-text-body-md">Brand Styled List Item 3</li>
                            </ul>

                            <h5 class="cbre-text-display-3 mb-2">Layout Components</h5>
                            <div class="space-y-4">
                                <div>
                                    <code
                                        class="text-lg text-blue-500 font-mono mb-1 block">.cbre-layout-topbar-separator</code>
                                    <div class="flex items-center gap-4 p-4 border border-gray-100 bg-white">
                                        <span class="cbre-nav-title">Title</span>
                                        <div class="cbre-layout-topbar-separator h-8">
                                            <span class="cbre-nav-link text-cbre-green/90">Separator</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <code
                                        class="text-lg text-blue-500 font-mono mb-1 block">.cbre-button-topbar-menu</code>
                                    <div class="flex p-4 border border-gray-100 bg-white">
                                        <button class="cbre-button-topbar-menu">
                                            Menu Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics -->
                <div>
                    <span class="cbre-text-label-sm text-gray-400 block mb-6">Statistics</span>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-stat-number</code>
                            <span class="cbre-text-stat-number block mb-2">500+</span>
                            <span class="cbre-text-body-md block">Offices Worldwide</span>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-stat-number</code>
                            <span class="cbre-text-stat-number block mb-2">$145B</span>
                            <span class="cbre-text-body-md block">Assets Under Management</span>
                        </div>
                        <div>
                            <code class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-stat-number</code>
                            <span class="cbre-text-stat-number block mb-2">115K</span>
                            <span class="cbre-text-body-md block">Employees</span>
                        </div>
                    </div>
                </div>

                <!-- Footer Links -->
                <div>
                    <span class="cbre-text-label-sm text-gray-400 block mb-6">Footer Typography</span>
                    <div class="bg-cbre-green p-12 -mx-6 md:-mx-12 lg:-mx-20">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div class="space-y-4">
                                <h4 class="text-white font-bold uppercase tracking-wider mb-6">Services</h4>
                                <div>
                                    <code
                                        class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-footer-link-lg</code>
                                    <a href="#" class="block cbre-text-footer-link-lg">Real Estate Services</a>
                                </div>
                                <a href="#" class="block cbre-text-footer-link-lg">Project Management</a>
                                <a href="#" class="block cbre-text-footer-link-lg">Investment Management</a>
                            </div>
                            <div class="space-y-2">
                                <h4 class="text-white font-bold uppercase tracking-wider mb-6">Company</h4>
                                <div>
                                    <code
                                        class="text-lg text-blue-500 font-mono mb-1 block">.cbre-text-footer-link-sm</code>
                                    <a href="#" class="block cbre-text-footer-link-sm">About Us</a>
                                </div>
                                <a href="#" class="block cbre-text-footer-link-sm">Careers</a>
                                <a href="#" class="block cbre-text-footer-link-sm">Corporate Responsibility</a>
                                <a href="#" class="block cbre-text-footer-link-sm">Investor Relations</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAppToast } from '~/composables/useAppToast';

const { showToast } = useAppToast()

// === State ===
const isOpen = ref(false) // Modal State
const isLoading = ref(false) // Loading State

// === Actions ===

// 1. Success Toast
const showSuccessToast = () => {
    showToast('Success', 'success', {
        description: 'Data has been saved successfully.',
        duration: 3000
    })
}

// 2. Error Toast
const showErrorToast = () => {
    showToast('Error Occurred', 'danger', {
        description: 'Failed to connect to the server.'
    })
}

// 3. Simulate Async Loading
const simulateLoading = () => {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        showSuccessToast()
    }, 2000) // 2s delay
}

// 4. Confirm Modal Action
const confirmModal = () => {
    isOpen.value = false
    showToast('Confirmed', 'success', {
        description: 'You have confirmed the action.',
        icon: 'i-heroicons-check-badge',
        duration: 3000
    })
}
</script>

<style scoped>
/* Scoped styles removed in favor of utility classes */
</style>
