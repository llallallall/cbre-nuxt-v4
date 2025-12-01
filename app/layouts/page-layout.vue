<template>
    <div id="PageLayout" class="bg-gray-100 h-screen font-sans">
        <div id="TopMenu"
            class="fixed top-0 w-full h-[80px] flex justify-between items-stretch px-4 md:px-6 lg:px-10 transition-all duration-500 bg-white text-cbre-green border-gray-200 border-b z-20">
            <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                <div class="min-w-[110px] flex items-center justify-center cursor-pointer" @click="navigateTo('/')">
                    <IconCBRELogo class="w-[80px] h-[25px] text-inherit" />
                    <sub class="text-[14px] font-bold translate-y-1 ml-1">Map</sub>
                </div>
                <div class="ml-[10px] h-[30px] pt-[8px] hidden md:flex whitespace-nowrap">
                    Property Management System
                </div>
                <div class="ml-[10px] h-[30px] pt-[8px] flex md:hidden whitespace-nowrap">
                    PMS
                </div>
            </div>

            <div id="right-menu" class="flex z-20 h-full">
                <div @click="navigateTo('/')"
                    class="group flex items-center px-4 h-full hover:bg-gray-100 cursor-pointer transition-colors">
                    <UIcon name="i-heroicons-home" class="w-5 h-5 group-hover:text-cbre-green" />
                    <span
                        class="hidden md:block ml-2 text-sm font-medium text-gray-700 group-hover:text-cbre-green">Home</span>
                </div>

                <div @click="goPrevious()"
                    class="group flex items-center justify-center h-full px-2 md:px-4 cursor-pointer transition-colors hover:bg-gray-100"
                    :class="!previousPropertyId ? 'opacity-50 cursor-not-allowed' : ''"
                    :title="previousPropertyId ? 'Previous Property' : 'No Previous Property'">
                    <div
                        class="flex items-center text-sm font-medium text-gray-700 group-hover:text-cbre-green whitespace-nowrap">
                        <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
                        <span class="hidden md:block">Previous</span>
                    </div>
                </div>

                <div @click="goNext()"
                    class="group flex items-center justify-center h-full px-2 md:px-4 cursor-pointer transition-colors hover:bg-gray-100"
                    :class="!nextPropertyId ? 'opacity-50 cursor-not-allowed' : ''"
                    :title="nextPropertyId ? 'Next Property' : 'No Next Property'">
                    <div
                        class="flex items-center text-sm font-medium text-gray-700 group-hover:text-cbre-green whitespace-nowrap">
                        <span class="hidden md:block">Next</span>
                        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
                    </div>
                </div>

                <div class="h-full w-[1px] bg-gray-200 mx-2 my-auto"></div>

                <div v-if="loggedIn" class="flex items-center h-full space-x-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden cursor-pointer" @click="openUserProfileModal"
                        :title="`Logged in as ${user?.name || 'User'}`">
                        <img :src="user?.avatar || '/images/avatar/avatar-placeholder.png'" alt="User Avatar"
                            class="w-full h-full object-cover" />
                    </div>
                    <UButton size="sm" color="primary" variant="solid" @click="handleLogout">Logout</UButton>
                </div>

                <div v-else class="flex items-center h-full">
                    <UButton size="sm" color="primary" variant="solid" @click="handleLogin">Login</UButton>
                </div>
            </div>
        </div>

        <main class="fixed top-[80px] w-full h-[calc(100%-80px)] overflow-y-auto">
            <slot />
        </main>
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

const { previousPropertyId, nextPropertyId } = storeToRefs(propertyStore)

const goPrevious = () => {
    if (propertyStore.setAssetNav(previousPropertyId.value)) router.push({ path: "/property/" + previousPropertyId.value })
}

const goNext = () => {
    if (propertyStore.setAssetNav(nextPropertyId.value)) router.push({ path: "/property/" + nextPropertyId.value })
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