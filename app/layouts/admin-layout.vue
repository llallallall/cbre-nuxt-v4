<template>
    <div id="AdminLayout" class="bg-white w-screen h-screen overflow-hidden font-sans">
        <div id="TopMenu"
            class="fixed top-0 w-full h-[80px] flex justify-between items-stretch px-4 md:px-6 lg:px-10 transition-all duration-500 bg-white text-cbre-green border-gray-200 border-b z-20">

            <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                <div class="min-w-[110px] flex items-center justify-center cursor-pointer"
                    @click="navigateTo('/admin')">
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
                <div v-for="(item, index) in filteredNavItems" :key="index"
                    class="group flex items-center px-2 md:px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-cbre-green/50 cursor-pointer"
                    @click="navigateTo(item.link)">
                    <div class="flex justify-center items-center gap-1 text-sm font-bold">
                        <UIcon :name="item.icon" class="w-5 h-5 text-gray-400 group-hover:text-cbre-green" />
                        <div class="hidden md:flex whitespace-nowrap">{{ item.label }}</div>
                    </div>
                </div>

                <div v-if="userRole === 'ADMIN' || userRole === 'DEVELOPER'"
                    class="h-full flex items-center justify-center cursor-pointer ml-3 px-2 transition-all duration-300"
                    :class="{ 'bg-cbre-green text-white': uiStore.isMenuOverlay }" @click="toggleAdminSideMenu">
                    <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
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

        <ul class="cb-slideshow">
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
        </ul>

        <div id="Content"
            class="absolute top-[80px] left-0 w-full h-[calc(100%-80px)] z-10 overflow-y-hidden bg-transparent">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '~/stores/ui'

const { loggedIn, user, clear } = useUserSession()
const uiStore = useUiStore()

// Role handling (assuming user object has role)
const userRole = computed(() => (user.value as any)?.role || 'USER')

interface NavItem {
    label: string
    link: string
    roles: string[]
    icon: string
}

const navItems: NavItem[] = [
    {
        label: 'Property List',
        link: '/admin',
        icon: 'i-solar-pen-new-square-outline',
        roles: ['USER', 'ADMIN', 'DEVELOPER']
    },
    {
        label: 'Users',
        link: '/user/list',
        icon: 'i-solar-user-outline',
        roles: ['ADMIN', 'DEVELOPER']
    },
    {
        label: 'Upload File',
        link: '/property/upload',
        icon: 'i-solar-upload-outline',
        roles: ['ADMIN', 'DEVELOPER']
    },
    {
        label: 'Download File',
        link: '/api/property/bulk',
        icon: 'i-solar-download-outline',
        roles: ['ADMIN', 'DEVELOPER']
    }
]

const filteredNavItems = computed(() => {
    return navItems.filter(item => item.roles.includes(userRole.value))
})

const toggleAdminSideMenu = () => {
    uiStore.toggleOverlay('menu')
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
@import '~/assets/css/layouts/admin.css';
</style>