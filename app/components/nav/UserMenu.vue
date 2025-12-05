<template>
        <div class="h-full flex items-center" @click.stop>
                <div class="flex items-center gap-2 px-4 h-full cursor-pointer transition-colors border-b-2 border-transparent hover:border-cbre-accent group"
                        @click="uiStore.toggleUserProfileModal(true)">
                        <div class="flex flex-col items-center">
                                <div
                                        class="w-[30px] h-[30px] rounded-full bg-gray-200 relative overflow-hidden object-cover border border-gray-300 group-hover:border-cbre-accent transition-colors">
                                        <img :src="userStore.getUserImage || '/images/avatar/avatar-placeholder.png'"
                                                class="w-full h-full object-cover" alt="User Avatar" />
                                </div>
                                <div class="flex items-center mt-1">
                                        <span class="font-calibre text-xs text-center max-w-[80px] truncate transition-colors duration-300 group-hover:text-cbre-accent"
                                                :class="uiStore.isLightMode ? 'text-cbre-green' : 'text-white'">
                                                {{ userStore.userName || 'User' }}
                                        </span>
                                </div>
                        </div>
                </div>
                <div class="absolute top-22 right-2">
                        <NavUserProfile v-if="uiStore.isUserProfileModalOpen" />
                </div>
        </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { useUiStore } from '~/stores/ui';





const props = defineProps<{
        // isLightMode?: boolean;
}>();

const userStore = useUserStore();
const uiStore = useUiStore();

onMounted(async () => {
        await userStore.getUser();
});
</script>
