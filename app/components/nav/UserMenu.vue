<template>
        <div
                class="inline-flex items-center px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-cbre-green/50">
                <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                        :popper="{ placement: 'bottom-end' }">
                        <div class="flex flex-col cursor-pointer items-center">
                                <div
                                        class="w-[30px] h-[30px] rounded-full bg-gray-200 relative overflow-hidden object-cover border border-gray-300">
                                        <img :src="userStore.getUserImage || '/images/avatar/avatar-placeholder.png'"
                                                class="w-full h-full object-cover" alt="User Avatar" />
                                </div>
                                <div class="flex items-center mt-1">
                                        <span class="font-calibre text-xs text-center max-w-[80px] truncate">
                                                {{ userStore.userName || 'User' }}
                                        </span>
                                        <UIcon name="i-heroicons-chevron-up-down" class="w-3 h-3 text-gray-400 ml-1" />
                                </div>
                        </div>

                        <template #item="{ item }">
                                <span class="truncate">{{ item.label }}</span>
                                <UIcon :name="item.icon"
                                        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                        </template>
                </UDropdown>

                <UserProfileModal v-model="uiStore.isUserProfileModalOpen"
                        @close="uiStore.toggleUserProfileModal(false)" />
        </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { useUiStore } from '~/stores/ui';

import UserProfileModal from '~/components/common/UserProfileModal.vue';

const userStore = useUserStore();
const uiStore = useUiStore();
const { clear } = useUserSession(); // Adjust based on actual auth implementation

onMounted(async () => {
        await userStore.getUser();
});

const openUserProfile = () => {
        uiStore.toggleUserProfileModal(true);
};

const handleLogOut = async () => {
        userStore.$reset();
        await clear();
        navigateTo('/login');
};

const items = computed(() => [
        [{
                label: 'Account',
                icon: 'i-heroicons-user',
                click: openUserProfile
        }, {
                label: 'Settings',
                icon: 'i-heroicons-cog-6-tooth',
                disabled: true // Placeholder
        }],
        [{
                label: 'Admin',
                icon: 'i-heroicons-shield-check',
                to: '/admin',
                target: '_blank'
        }],
        [{
                label: 'Sign out',
                icon: 'i-heroicons-arrow-right-on-rectangle',
                click: handleLogOut,
                class: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50'
        }]
]);
</script>
