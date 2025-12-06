<template>
    <div id="PageLayout" class="bg-cbre-gray-50 h-screen font-sans">
        <div id="TopMenu" class="cbre-layout-topbar">
            <div id="LeftMenu" class="cbre-layout-topbar-left">
                <div class="cbre-nav-brand group" @click="navigateTo('/')">
                    <IconCBRELogo
                        class="w-[9rem] h-[2.8rem] group-hover:opacity-90 transition-opacity text-cbre-green" />
                    <sub class="cbre-nav-brand-label text-cbre-green">Map</sub>
                </div>

                <!-- Title -->
                <div class="cbre-layout-topbar-separator">
                    <span class="cbre-nav-title text-cbre-green/90">Property Management System</span>
                </div>
                <div class="cbre-layout-topbar-separator-mobile">
                    <span class="cbre-nav-link text-cbre-green/90">PMS</span>
                </div>
            </div>

            <div id="right-menu" class="cbre-layout-topbar-right">

                <div class="flex items-center gap-2">
                    <div @click="goPrevious()" class="cbre-button-nav-circle"
                        :class="{ 'disabled': !previousPropertyId }"
                        :title="previousPropertyId ? 'Previous Property' : 'No Previous Property'">
                        <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                            class="w-[1.4rem] h-[1.4rem] rotate-180 text-inherit">
                            <path
                                d="M0.619873 8.99985L21.3766 8.99985M21.3766 8.99985L14.5487 1.21606M21.3766 8.99985L14.5487 16.7836"
                                stroke="currentColor" stroke-width="1.31081" />
                        </svg>
                    </div>

                    <div @click="goNext()" class="cbre-button-nav-circle" :class="{ 'disabled': !nextPropertyId }"
                        :title="nextPropertyId ? 'Next Property' : 'No Next Property'">
                        <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                            class="w-[1.4rem] h-[1.4rem] text-inherit">
                            <path
                                d="M0.619873 8.99985L21.3766 8.99985M21.3766 8.99985L14.5487 1.21606M21.3766 8.99985L14.5487 16.7836"
                                stroke="currentColor" stroke-width="1.31081" />
                        </svg>
                    </div>
                </div>

                <div class="cbre-layout-divider"></div>

                <div v-if="loggedIn" class="cbre-layout-topbar-user-section">
                    <div class="cbre-avatar-user-container" @click="openUserProfileModal"
                        :title="`Logged in as ${user?.name || 'User'}`">
                        <img :src="userAvatar" alt="User Avatar" class="w-full h-full object-cover" />
                    </div>
                    <button class="cbre-button-brief-sm" @click="handleLogout">Logout</button>
                </div>

                <div v-else class="cbre-layout-topbar-user-section">
                    <button class="cbre-button-brief-sm" @click="handleLogin">Login</button>
                </div>

                <!-- Mobile Navigation Toggle -->
                <div class="flex md:hidden ml-4">
                    <button class="cbre-button-nav-toggle"
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
                        <span class="cbre-mobile-nav-item group-hover:text-cbre-green-800">Map Home</span>
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

const router = useRouter()
const propertyStore = usePropertyStore()
const uiStore = useUiStore()
const { loggedIn, user, clear } = useUserSession()
const userAvatar = computed(() => (user.value as any)?.avatar || '/images/avatar/avatar-placeholder.png')

const { previousPropertyId, nextPropertyId } = storeToRefs(propertyStore)

const goPrevious = () => {
    if (previousPropertyId.value && propertyStore.setAssetNav(previousPropertyId.value)) router.push({ path: "/property/" + previousPropertyId.value })
}

const goNext = () => {
    if (nextPropertyId.value && propertyStore.setAssetNav(nextPropertyId.value)) router.push({ path: "/property/" + nextPropertyId.value })
}

const openUserProfileModal = () => {
    uiStore.toggleUserProfileModal(true)
}

const handleLogout = async () => {
    await clear()
    navigateTo('/login')
}

const handleLogin = () => {
    navigateTo('/login')
}
</script>

<style scoped>
/* Scoped styles if needed */
</style>