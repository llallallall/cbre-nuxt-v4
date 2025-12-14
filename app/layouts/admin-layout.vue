<template>
    <div id="AdminLayout" class="bg-white w-screen h-screen overflow-hidden font-sans">
        <div id="TopMenu" class="cbre-layout-topbar">
            <div id="LeftMenu" class="cbre-layout-topbar-left">
                <div class="cbre-nav-brand group" @click="navigateTo('/admin')">
                    <IconCBRELogo
                        class="w-[9rem] h-[2.8rem] group-hover:opacity-90 transition-opacity text-cbre-green" />
                    <sub class="cbre-nav-brand-label text-cbre-green">{{ $t('nav.brand.map') }}</sub>
                </div>

                <!-- Title -->
                <div class="cbre-layout-topbar-separator">
                    <span class="cbre-nav-title text-cbre-green/90">{{ $t('nav.brand.title') }}</span>
                </div>
                <div class="cbre-layout-topbar-separator-mobile">
                    <span class="cbre-nav-link text-cbre-green/90">{{ $t('nav.brand.pms_short') }}</span>
                </div>
            </div>

            <div id="right-menu" class="cbre-layout-topbar-right">
                <div class="flex items-center">
                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center transform translate-x-[10px]">
                        <button v-for="(item, index) in filteredNavItems" :key="index"
                            class="group cbre-button-topbar-menu" @click="navigateTo(item.link)">
                            <span>{{ $t(item.label) }}</span>
                        </button>
                    </div>

                    <!-- Mobile Navigation Toggle -->
                    <div class="flex md:hidden ml-4 transform translate-x-[10px]">
                        <button class="cbre-button-nav-toggle" @click="toggleAdminSideMenu">
                            <UIcon :name="uiStore.isMenuOverlay ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
                                size="30" />
                        </button>
                    </div>
                </div>

                <div class="cbre-layout-divider"></div>

                <!-- Docs Link -->
                <UTooltip :text="$t('docs.title')" :popper="{ placement: 'bottom' }">
                    <button @click="uiStore.toggleDocsModal(true)"
                        class="group cbre-button-topbar-menu text-cbre-green transition-colors">
                        <UIcon name="i-heroicons-book-open" class="w-5 h-5 group-hover:text-cbre-accent" />
                    </button>
                </UTooltip>

                <div class="cbre-layout-divider"></div>

                <CommonLanguageSwitcher />

                <div class="cbre-layout-divider"></div>

                <div class="cbre-layout-topbar-user-section">
                    <NavUserMenu />
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
        <!-- <Transition name="cbre-transition-fade">
            <div v-if="uiStore.isMenuOverlay"
                class="fixed inset-0 bg-black/40 z-[55] lg:hidden"
                @click="toggleAdminSideMenu">
            </div>
        </Transition> -->

        <!-- Mobile Side Panel -->
        <Transition name="cbre-transition-slide-down">
            <div v-show="uiStore.isMenuOverlay" class="cbre-mobile-panel lg:hidden block ">
                <div class="flex flex-col h-full overflow-y-auto pb-8 pt-8">
                    <div v-for="(item, index) in filteredNavItems" :key="index" class="px-8 py-2 cursor-pointer group"
                        @click="navigateTo(item.link); toggleAdminSideMenu()">
                        <span class="cbre-mobile-nav-item group-hover:text-cbre-green-800">{{ $t(item.label)
                        }}</span>
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
        label: 'nav.admin.property_list',
        link: '/admin',
        icon: 'i-solar-pen-new-square-outline',
        roles: ['USER', 'ADMIN', 'DEVELOPER']
    },
    {
        label: 'nav.admin.users',
        link: '/user/list',
        icon: 'i-solar-user-outline',
        roles: ['USER', 'ADMIN', 'DEVELOPER']
    },
    {
        label: 'nav.admin.upload_file',
        link: '/property/upload',
        icon: 'i-solar-upload-outline',
        roles: ['USER', 'ADMIN', 'DEVELOPER']
    },
    {
        label: 'nav.admin.download_file',
        link: '/api/property/bulk',
        icon: 'i-solar-download-outline',
        roles: ['USER', 'ADMIN', 'DEVELOPER']
    }
]

const filteredNavItems = computed(() => {
    return navItems.filter(item => item.roles.includes(userRole.value))
})

const toggleAdminSideMenu = () => {
    uiStore.toggleOverlay('menu')
}
</script>
