                </div>
                <div class="ml-[10px] h-[30px] pt-[8px]">
                    <span v-if="isDesktop" class="whitespace-nowrap">{{ $t('app_title') }}</span>
                    <span v-else class="whitespace-nowrap">{{ $t('pms_short') }}</span>
                </div>
            </div>

            <!-- Right Menu -->
            <div id="right-menu" class="flex items-center z-20 h-full gap-2">

                <!-- Desktop Navigation -->
                <template v-if="isDesktop">
                    <UButton v-for="(item, index) in filteredNavItems" :key="index" :to="item.link" variant="ghost"
                        color="neutral" class="hover:text-cbre-green">
                        <UIcon :name="item.icon" class="w-5 h-5" />
                        <span>{{ $t(item.labelKey) }}</span>
                    </UButton>
                </template>

<!-- Mobile Navigation (Hamburger) -->
<template v-else>
                    <UPopover mode="click">
                        <UButton icon="i-heroicons-bars-3" color="neutral" variant="ghost" />
                        <template #content>
                            <div class="p-4 flex flex-col gap-2 min-w-[200px]">
                                <UButton v-for="(item, index) in filteredNavItems" :key="index" :to="item.link"
                                    variant="ghost" color="neutral" class="justify-start hover:text-cbre-green"
                                    @click="isMobileMenuOpen = false">
                                    <UIcon :name="item.icon" class="w-5 h-5" />
                                    <span>{{ $t(item.labelKey) }}</span>
                                </UButton>
                            </div>
                        </template>
</UPopover>
</template>

<div class="h-8 w-[1px] bg-gray-200 mx-2"></div>

<!-- User Profile / Login -->
<div v-if="loggedIn" class="flex items-center gap-3">
                    <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'bottom-end' }">
                        <UAvatar :src="user?.image || '/images/avatar/avatar-placeholder.png'"
                            :alt="user?.name || 'User'" class="cursor-pointer border border-gray-200" />
                    </UDropdownMenu>
                </div>

<div v-else>
                    <UButton :to="'/login'" color="primary" variant="solid" size="sm">
                        {{ $t('login') }}
                    </UButton>
                </div>
</div>
</div>

<!-- Slideshow Background -->
<ul class="cb-slideshow">
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
        </ul>

<div id="Content" class="absolute top-[80px] left-0 w-full h-[calc(100%-80px)] z-10 overflow-y-hidden bg-transparent">
            <slot />
        </div>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Modules
const { t } = useI18n();
const { isDesktop } = useDevice();
const { loggedIn, user, clear } = useUserSession();

// State
const isMobileMenuOpen = ref(false);

// Types
type RoleEnum = 'USER' | 'ADMIN' | 'DEVELOPER';

interface NavItem {
    labelKey: string;
    link: string;
    roles: RoleEnum[];
    icon: string;
}

// Navigation Items
const navItems: NavItem[] = [
    {
        labelKey: 'property_list',
        link: '/admin',
        icon: 'i-solar-pen-new-square-outline',
        roles: ['USER', 'ADMIN', 'DEVELOPER']
    },
    {
        labelKey: 'users',
        link: '/user/list',
        icon: 'i-solar-user-outline',
        roles: ['ADMIN', 'DEVELOPER']
    },
    {
        labelKey: 'upload_file',
        link: '/property/upload',
        icon: 'i-solar-upload-outline',
        roles: ['ADMIN', 'DEVELOPER']
    },
    {
        labelKey: 'download_file',
        link: '/api/property/bulk',
        icon: 'i-solar-download-outline',
        roles: ['ADMIN', 'DEVELOPER']
    }
];

// Computed
const userRole = computed(() => (user.value?.role as RoleEnum) || 'USER');

const filteredNavItems = computed(() => {
    return navItems.filter(item => item.roles.includes(userRole.value));
});

// User Dropdown Items
const userDropdownItems = computed(() => [
    [{
        label: user.value?.name || 'User',
        slot: 'account',
        disabled: true
    }],
    [{
        label: t('logout'),
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: handleLogout
    }]
]);

// Actions
const handleLogout = async () => {
    // await clear(); // Commented out to prevent errors if auth is not fully set up
    // navigateTo('/login');
    console.log('Logout clicked - Logic commented out for safety');
};
</script>

<style scoped>
@import '~/assets/css/layouts/admin.css';
</style>