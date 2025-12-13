<template>
    <div id="PageLayout" class="bg-cbre-gray-50 h-screen font-sans">
        <div id="TopMenu" class="cbre-layout-topbar bg-cbre-green text-white border-0 border-white/10">
            <div id="LeftMenu" class="cbre-layout-topbar-left">
                <div class="cbre-nav-brand group" @click="navigateTo('/')">
                    <IconCBRELogo
                        class="w-[9rem] h-[2.8rem] group-hover:opacity-90 transition-opacity text-white" />
                    <sub class="cbre-nav-brand-label text-white">{{ $t('nav.brand.map') }}</sub>
                </div>

                <!-- Title -->
                <div class="cbre-layout-topbar-separator border-white/20">
                    <span class="cbre-nav-title text-white">{{ $t('nav.brand.title') }}</span>
                </div>
                <div class="cbre-layout-topbar-separator-mobile border-white/20">
                    <span class="cbre-nav-link text-white">{{ $t('nav.brand.pms_short') }}</span>
                </div>
            </div>

            <div id="right-menu" class="cbre-layout-topbar-right">

                <div class="flex items-center gap-2">
                    <div @click="goPrevious()" class="cbre-button-nav-circle hover:bg-white/10 text-white border-white/80"
                        :class="{ 'disabled opacity-50': !previousPropertyId }"
                        :title="previousPropertyId ? $t('previous_property') : $t('no_previous_property')">
                        <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                            class="w-[1.4rem] h-[1.4rem] rotate-180 text-white">
                            <path
                                d="M0.619873 8.99985L21.3766 8.99985M21.3766 8.99985L14.5487 1.21606M21.3766 8.99985L14.5487 16.7836"
                                stroke="currentColor" stroke-width="1.31081" />
                        </svg>
                    </div>

                    <div @click="goNext()" class="cbre-button-nav-circle hover:bg-white/10 text-white border-white/80" :class="{ 'disabled opacity-50': !nextPropertyId }"
                        :title="nextPropertyId ? $t('next_property') : $t('no_next_property')">
                        <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                            class="w-[1.4rem] h-[1.4rem] text-inherit text-white">
                            <path
                                d="M0.619873 8.99985L21.3766 8.99985M21.3766 8.99985L14.5487 1.21606M21.3766 8.99985L14.5487 16.7836"
                                stroke="currentColor" stroke-width="1.31081" />
                        </svg>
                    </div>
                </div>

                <div class="cbre-layout-divider bg-white/20"></div>

                <CommonLanguageSwitcher class="text-white" />

                <div class="cbre-layout-divider bg-white/20"></div>

                <NavUserMenu :isLightMode="false" class="transform translate-y-1 text-white"/>

                <!-- Mobile Navigation Toggle -->
                <div class="flex md:hidden ml-4">
                    <button class="cbre-button-nav-toggle border-white/20 text-white hover:bg-white/10"
                        :class="{ 'bg-cbre-green text-white': uiStore.isMenuOverlay }"
                        @click="uiStore.isMenuOverlay = !uiStore.isMenuOverlay">
                        <UIcon :name="uiStore.isMenuOverlay ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
                            class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>

        <main class="cbre-layout-content-fixed">
            <slot />
        </main>

        <!-- Backdrop -->
        <Transition name="cbre-transition-fade">
            <div v-if="uiStore.isMenuOverlay" class="fixed inset-0 bg-black/40 z-[55] lg:hidden"
                @click="uiStore.isMenuOverlay = false">
            </div>
        </Transition>

        <!-- Mobile Side Panel -->
        <Transition name="cbre-transition-slide-down">
            <div v-show="uiStore.isMenuOverlay" class="cbre-mobile-panel lg:hidden block">
                <div class="flex flex-col h-full overflow-y-auto pb-8 pt-8">
                    <div class="px-8 py-2 cursor-pointer group" @click="navigateTo('/'); uiStore.isMenuOverlay = false">
                        <span class="cbre-mobile-nav-item group-hover:text-cbre-green-800">{{ $t('nav.menu.home')
                            }}</span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePropertyStore } from '~/stores/property'
import { useUiStore } from '~/stores/ui'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const propertyStore = usePropertyStore()
const uiStore = useUiStore()
const userStore = useUserStore()
const { t } = useI18n()

const { clear } = useUserSession()

// Session Synchronization
onMounted(async () => {
    await userStore.getUser()
    if (propertyStore.initialProperties.length === 0) {
        await propertyStore.fetchInitialData()
    }
})

const { previousPropertyId, nextPropertyId } = storeToRefs(propertyStore)

const goPrevious = async () => {
    const targetId = previousPropertyId.value;
    if (targetId) {
        if (propertyStore.setAssetNav(targetId)) {
            await navigateTo("/property/" + targetId);
        }
    } else {
        useAppToast().showToast(t('no_previous_property'), 'warning'); // Or 'info'
    }
}

const goNext = async () => {
    const targetId = nextPropertyId.value;
    if (targetId) {
         if (propertyStore.setAssetNav(targetId)) {
             await navigateTo("/property/" + targetId);
         }
    } else {
        useAppToast().showToast(t('no_next_property'), 'warning');
    }
}
</script>

<style scoped>
/* Scoped styles if needed */
</style>