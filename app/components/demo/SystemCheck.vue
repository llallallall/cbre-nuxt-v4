<template>
    <div class="min-h-screen bg-white p-8">
        <!-- Header & Settings -->
        <header
            class="mb-12 border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="cbre-text-hero mb-2">CBRE UX System Check</h1>
                <p class="cbre-text-body-large text-gray-600">
                    {{ $t('welcome_message', 'Modules Integration Test Page') }}
                </p>
            </div>

            <!-- 다국어 전환 버튼 (Flag Icons) -->
            <div class="flex items-center gap-3">
                <!-- English (US Flag) -->
                <button @click="setLocale('en')" class="transition-transform hover:scale-110 focus:outline-none"
                    :class="{ 'opacity-100 grayscale-0': locale === 'en', 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': locale !== 'en' }"
                    title="English">
                    <IconFlagUS class="w-8 h-6 shadow-sm rounded-sm" />
                </button>

                <!-- Korean (KR Flag) -->
                <button @click="setLocale('ko')" class="transition-transform hover:scale-110 focus:outline-none"
                    :class="{ 'opacity-100 grayscale-0': locale === 'ko', 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': locale !== 'ko' }"
                    title="한국어">
                    <IconFlagKR class="w-8 h-6 shadow-sm rounded-sm" />
                </button>
            </div>
        </header>

        <!-- === UX Feature Demos === -->
        <section class="mb-16 p-6 bg-gray-50 border border-gray-200">
            <h2 class="cbre-text-h2 mb-6 border-l-4 border-cbre-green pl-4">
                UX Features Demo (Nuxt UI)
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                <!-- 1. Toast Notifications -->
                <div class="space-y-4">
                    <h3 class="cbre-text-h3 mb-4">1. Toast Notifications</h3>
                    <p class="text-sm text-gray-600 mb-4">Provides non-intrusive feedback.</p>
                    <div class="flex gap-2">
                        <UButton color="primary" variant="solid" class="rounded-none uppercase"
                            @click="showSuccessToast">
                            Success Toast
                        </UButton>
                        <UButton color="error" variant="outline" class="rounded-none uppercase" @click="showErrorToast">
                            Error Toast
                        </UButton>
                    </div>
                </div>

                <!-- 2. Modal Dialog -->
                <div class="space-y-4">
                    <h3 class="cbre-text-h3 text-lg">2. Modal Dialog</h3>
                    <p class="text-sm text-gray-600 mb-4">Focuses user attention.</p>
                    <UButton variant="ghost" icon="i-heroicons-window" class="cbre-btn-secondary rounded-none"
                        @click="isOpen = true">
                        Open Modal
                    </UButton>
                </div>

                <!-- 3. Loading States -->
                <div class="space-y-4">
                    <h3 class="cbre-text-h3 text-lg">3. Loading States</h3>
                    <p class="text-sm text-gray-600 mb-4">Improves perceived performance.</p>
                    <div class="flex items-center gap-4">
                        <!-- 버튼 로딩 -->
                        <UButton :loading="isLoading" color="primary" variant="solid" class="rounded-none uppercase"
                            @click="simulateLoading">
                            Fetch Data (2s)
                        </UButton>
                    </div>
                    <!-- 스켈레톤 로딩 (데이터 로딩 중일 때 표시) -->
                    <div v-if="isLoading" class="space-y-2">
                        <USkeleton class="h-4 w-[250px]" />
                        <USkeleton class="h-4 w-[200px]" />
                    </div>
                </div>

            </div>

        </section>

        <!-- === Hover Effects Demo === -->
        <section class="mb-16">
            <h2 class="cbre-text-h2 mb-6 border-l-4 border-cbre-green pl-4">
                CBRE Hover Effects
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                <!-- 1. CTA Link (Left Line -> Right Arrow) -->
                <div class="p-6 bg-white border border-gray-100 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">1. Animated Arrow Link
                        (.cbre-link-animated-arrow)</h3>
                    <a href="#" class="cbre-link-animated-arrow">
                        View Property Details
                    </a>
                    <p class="mt-4 text-sm text-gray-500">Hover to see the left line disappear and the arrow
                        appear on the right.</p>
                </div>

                <!-- 2. Zone 2 Link (Large Serif + Underline) -->
                <div class="p-6 bg-white border border-gray-100 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">2. Large Serif Link (.cbre-link-large-serif)
                    </h3>
                    <a href="#" class="cbre-link-large-serif">
                        Global Investment Outlook
                    </a>
                    <p class="mt-4 text-sm text-gray-500">Large serif font. Hover for a thick underline effect.
                    </p>
                </div>

                <!-- 3. Grid Card Title Link (Bold Sans + Underline Color) -->
                <div class="p-6 bg-white border border-gray-100 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">3. Underline Slide Link
                        (.cbre-link-underline-slide)
                    </h3>
                    <div class="cbre-card">
                        <a href="#" class="cbre-link-underline-slide">
                            2024 Asia Pacific Real Estate Market Outlook
                        </a>
                    </div>
                    <p class="mt-4 text-sm text-gray-500">Bold sans-serif. Hover changes underline color to
                        green.</p>
                </div>

                <!-- 4. Arrow Link (Fade-in Top Line + Arrow) -->
                <div class="p-6 bg-white border border-gray-100 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">4. Fade Arrow Link (.cbre-link-fade-arrow)
                        [NEW]
                    </h3>
                    <a href="#" class="cbre-link-fade-arrow">
                        Read the Report
                    </a>
                    <p class="mt-4 text-sm text-gray-500">Hover to see the top line fade in and the arrow change
                        color.</p>
                </div>

                <!-- 5. Generic Link -->
                <div class="p-6 bg-white border border-gray-100 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">5. Generic Link (a tag)</h3>
                    <p>
                        Visit our <a href="#">About Us</a> page for more information.
                    </p>
                    <p class="mt-4 text-sm text-gray-500">Standard link style for body text.</p>
                </div>

                <!-- 6. Buttons -->
                <div class="p-6 bg-white border border-gray-100 shadow-sm col-span-1 md:col-span-2">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">6. Buttons</h3>
                    <div class="flex gap-4 flex-wrap">
                        <button class="cbre-btn-primary">Primary Button</button>
                        <button class="cbre-btn-secondary">Secondary Button</button>
                        <button class="cbre-btn-brief">Brief</button>
                    </div>
                </div>

                <!-- 7. Image Hover -->
                <div class="space-y-4 col-span-1 md:col-span-2">
                    <h3 class="font-semibold text-lg">7. Image Hover</h3>
                    <div class="w-full h-48 cbre-image-wrapper bg-gray-200">
                        <!-- Placeholder Image -->
                        <img src="https://placehold.co/600x400/003F2D/FFFFFF?text=CBRE+Property" alt="Property"
                            class="cbre-image">
                        <div class="cbre-image-overlay"></div>
                    </div>
                </div>

            </div>
        </section>

        <!-- === Font Family Demo [NEW] === -->
        <section class="mb-16">
            <h2 class="cbre-text-h2 mb-6 border-l-4 border-cbre-green pl-4">
                Font Family Demo
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Financier -->
                <div class="p-6 border border-gray-200">
                    <h3 class="cbre-text-h3 mb-2">Financier Display</h3>
                    <p class="text-sm text-gray-600 mb-4">Serif / Headings & Body</p>
                    <p class="font-serif text-3xl mb-2">Aa Bb Cc</p>
                    <p class="font-serif text-lg">The quick brown fox jumps over the lazy dog.</p>
                </div>
                <!-- Calibre -->
                <div class="p-6 border border-gray-200">
                    <h3 class="cbre-text-h3 mb-2 font-sans">Calibre</h3>
                    <p class="text-sm text-gray-600 mb-4">Sans-serif / UI & Labels</p>
                    <p class="font-sans text-3xl mb-2">Aa Bb Cc</p>
                    <p class="font-sans text-lg">The quick brown fox jumps over the lazy dog.</p>
                </div>
                <!-- Barlow Condensed -->
                <div class="p-6 border border-gray-200">
                    <h3 class="cbre-text-h3 mb-2 font-condensed">Barlow Condensed</h3>
                    <p class="text-sm text-gray-600 mb-4">Condensed / Data</p>
                    <p class="font-condensed text-3xl mb-2">1,234,567</p>
                    <p class="font-condensed text-lg">DATA VISUALIZATION</p>
                </div>
                <!-- Space Mono -->
                <div class="p-6 border border-gray-200">
                    <h3 class="cbre-text-h3 mb-2 cbre-font-mono">Space Mono</h3>
                    <p class="text-sm text-gray-600 mb-4">Monospace / Code & Tech</p>
                    <p class="cbre-font-mono text-3xl mb-2">101010</p>
                    <p class="cbre-font-mono text-lg">console.log('CBRE')</p>
                </div>
            </div>
        </section>

        <!-- === Typography System Demo === -->
        <section class="mb-16">
            <h2 class="cbre-text-h2 mb-6 border-l-4 border-cbre-green pl-4">
                Typography System Demo
            </h2>

            <div class="space-y-8">
                <!-- Hero Text -->
                <div>
                    <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-hero</span>
                    <h1 class="cbre-text-hero">
                        We are the global leader in commercial real estate services and investments.
                    </h1>
                </div>

                <!-- H1 Heading -->
                <div>
                    <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-h1</span>
                    <h1 class="cbre-text-h1">
                        Latest Insights
                    </h1>
                </div>

                <!-- H2 Heading -->
                <div>
                    <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-h2</span>
                    <h2 class="cbre-text-h2">
                        Global Life Sciences Atlas
                    </h2>
                </div>

                <!-- H3 Heading -->
                <div>
                    <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-h3</span>
                    <h3 class="cbre-text-h3">
                        The Room Where It Happens
                    </h3>
                </div>

                <!-- Body Text Large -->
                <div>
                    <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-body-large (Serif)</span>
                    <p class="cbre-text-body-large">
                        With services, insights and data that span every dimension of the industry, we create solutions
                        for clients of every size, in every sector and across every geography.
                    </p>
                </div>

                <!-- Body Text Standard -->
                <div>
                    <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-body (Serif)</span>
                    <p class="cbre-text-body">
                        Our 500 global researchers offer actionable intelligence and a multi-dimensional perspective
                        that is unparalleled in the industry.
                    </p>
                </div>

                <!-- Label & Meta -->
                <div class="flex gap-8">
                    <div>
                        <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-label (Sans)</span>
                        <span class="cbre-text-label">
                            Report | Intelligent Investment
                        </span>
                    </div>
                    <div>
                        <span class="text-xs text-gray-600 uppercase block mb-2">.cbre-text-meta (Sans)</span>
                        <span class="cbre-text-meta">
                            April 11, 2025
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- === Modal Component === -->
        <UModal v-model:open="isOpen">
            <template #content>
                <UCard :ui="{ root: 'rounded-none bg-white ring-1 ring-cbre-gray-200' }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="cbre-text-h3 text-cbre-green">
                                Detailed Information
                            </h3>
                            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                                class="-my-1 rounded-none" @click="isOpen = false" />
                        </div>
                    </template>

                    <div class="py-6">
                        <p class="cbre-text-body text-lg leading-relaxed">
                            This is a modal dialog styled with CBRE design system (Squared corners, Official
                            colors).
                            It uses Nuxt UI's `UModal` component.
                        </p>
                    </div>

                    <template #footer>
                        <div class="flex justify-end gap-3">
                            <UButton variant="ghost" class="cbre-btn-secondary" @click="isOpen = false">
                                Cancel</UButton>
                            <UButton color="primary" variant="solid" class="rounded-none" @click="confirmModal">Confirm
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { useAppToast } from '~/composables/useAppToast';

const { showToast } = useAppToast()
const { locale, setLocale, t } = useI18n()

// === State ===
const isOpen = ref(false) // 모달 상태
const isLoading = ref(false) // 로딩 상태

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
    }, 2000) // 2초 후 로딩 종료
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
