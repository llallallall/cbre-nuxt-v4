<template>
    <div id="AdminLayout" class="bg-white w-screen h-screen overflow-hidden font-sans">
        <div id="TopMenu" class="cbre-layout-topbar">
            <div id="LeftMenu" class="cbre-topbar-left">
                <div class="cbre-brand-lockup group"
                    @click="navigateTo('/admin')">
                    <IconCBRELogo class="w-[9rem] h-[2.8rem] group-hover:opacity-90 transition-opacity text-cbre-green" />
                    <sub class="cbre-brand-label text-cbre-green">Map</sub>
                </div>
                
                <!-- Title -->
                <div class="cbre-topbar-title-separator">
                    <span class="cbre-navbar-title text-cbre-green/90">Property Management System</span>
                </div>
                <div class="cbre-topbar-title-separator-mobile">
                    <span class="cbre-nav-link text-cbre-green/90">PMS</span>
                </div>
            </div>

            <div id="right-menu" class="cbre-topbar-right">
                <div class="flex items-center">
                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center">
                        <button v-for="(item, index) in filteredNavItems" :key="index"
                            class="group cbre-topbar-menu-btn"
                            @click="navigateTo(item.link)">
                            <span>{{ item.label }}</span>
                        </button>
                    </div>

                    <!-- Mobile Navigation Toggle -->
                    <div class="flex md:hidden ml-4">
                        <button class="cbre-nav-toggle"
                            @click="toggleAdminSideMenu">
                            <UIcon :name="uiStore.isMenuOverlay ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" size="30" />
                        </button>
                    </div>
                </div>

                <div class="cbre-layout-divider"></div>

                <div v-if="loggedIn" class="cbre-topbar-user-section">
                    <div class="cbre-user-avatar-container" @click="openUserProfileModal"
                        :title="`Logged in as ${user?.name || 'User'}`">
                        <img :src="userAvatar" alt="User Avatar" class="w-full h-full object-cover" />
                    </div>
                    <button class="cbre-btn-brief-sm" @click="handleLogout">Logout</button>
                </div>

                <div v-else class="cbre-topbar-user-section">
                    <button class="cbre-btn-brief-sm" @click="handleLogin">Login</button>
                </div>
            </div>
        </div>

        <ul class="cbre-layout-slideshow">
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
        </ul>

        <div id="Content" class="cbre-layout-content-absolute">
            <slot />
        </div>

        <!-- Backdrop -->
        <!-- <Transition name="cbre-fade">
            <div v-if="uiStore.isMenuOverlay"
                class="fixed inset-0 bg-black/40 z-[55] lg:hidden"
                @click="toggleAdminSideMenu">
            </div>
        </Transition> -->

        <!-- Mobile Side Panel -->
        <Transition name="cbre-slide-down">
            <div v-show="uiStore.isMenuOverlay" class="cbre-mobile-panel lg:hidden block ">
                <div class="flex flex-col h-full overflow-y-auto pb-8 pt-8">
                    <div v-for="(item, index) in filteredNavItems" :key="index"
                        class="px-8 py-2 cursor-pointer group"
                        @click="navigateTo(item.link); toggleAdminSideMenu()">
                        <span class="cbre-mobile-nav-item group-hover:text-cbre-green-800">{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '~/stores/ui'

const { loggedIn, user, clear } = useUserSession()
const uiStore = useUiStore()

// Role handling (assuming user object has role)
const userRole = computed(() => (user.value as any)?.role || 'USER')
const userAvatar = computed(() => (user.value as any)?.avatar || '/images/avatar/avatar-placeholder.png')

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
        roles: ['USER','ADMIN', 'DEVELOPER']
    },
    {
        label: 'Upload File',
        link: '/property/upload',
        icon: 'i-solar-upload-outline',
        roles: ['USER','ADMIN', 'DEVELOPER']
    },
    {
        label: 'Download File',
        link: '/api/property/bulk',
        icon: 'i-solar-download-outline',
        roles: ['USER','ADMIN', 'DEVELOPER']
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
