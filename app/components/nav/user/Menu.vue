<template>
        <div class="h-full flex items-center" @click.stop>
                <!-- Logged In: User Profile & Menu -->
                <div v-if="userStore.isLogin" class="h-full flex items-end mb-6">
                        <UTooltip :text="$t('tooltip.profile')" :popper="{ placement: 'bottom' }">
                                <div class="flex items-end gap-2 px-4 h-full cursor-pointer transition-colors border-b-2 border-transparent hover:border-cbre-accent group"
                                        @click="uiStore.toggleUserProfileModal(true)">
                                        <div class="flex flex-col items-center">
                                                <div
                                                        class="w-[30px] h-[30px] rounded-full bg-gray-200 relative overflow-hidden object-cover border border-gray-300 group-hover:border-cbre-accent transition-colors">
                                                        <img :src="userStore.getUserImage || '/images/avatar/avatar-placeholder.png'"
                                                                class="w-full h-full object-cover" alt="User Avatar" />
                                                </div>
                                                <div class="flex items-center mt-1">
                                                        <UTooltip :text="userStore.userName || 'User'" :popper="{ placement: 'bottom' }">
                                                                <span class="font-calibre text-xs text-center max-w-[80px] truncate transition-colors duration-300 group-hover:text-cbre-accent block"
                                                                        :class="isLightMode ? 'text-cbre-green' : 'text-white'">
                                                                        {{ userStore.userName || 'User' }}
                                                                </span>
                                                        </UTooltip>
                                                </div>
                                        </div>
                                </div>
                        </UTooltip>
                </div>

                <!-- Logged Out: Login Button -->
                <UTooltip v-else :text="$t('tooltip.login')" :popper="{ placement: 'bottom' }">
                        <div class="cbre-button-topbar-menu px-0 ml-0 mr-2"
                                :class="isLightMode ? 'text-cbre-green' : 'text-white'" @click="handleLogin">
                                {{ $t('login') }}
                        </div>
                </UTooltip>

                <div class="absolute top-[8rem] right-2">
                        <NavUserProfile />
                </div>
        </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useUiStore } from '~/stores/ui';

const props = withDefaults(defineProps<{
        isLightMode?: boolean;
}>(), {
        isLightMode: true // Default to true (Light Mode) if not provided
});

const userStore = useUserStore();
const uiStore = useUiStore();

onMounted(async () => {
        await userStore.getUser();
});

const handleLogin = () => {
        navigateTo('/login');
}
</script>
