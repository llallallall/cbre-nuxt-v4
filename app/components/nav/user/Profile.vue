<template>
    <CommonModal v-model="isUserProfileModalOpen" maxWidth="sm:max-w-[50rem]">
        <div class="flex flex-col h-full overflow-hidden font-calibre bg-white w-full">
            <!-- Profile View -->
            <div class="w-full p-8 flex flex-col items-center relative">
              
                <img :src="userStore.getUserImage || '/images/avatar/avatar-placeholder.png'" alt="User Avatar"
                    class="w-64 h-64 rounded-full object-cover border-2 border-cbre-green shadow-md mb-2" />

                <div class="text-center mt-4 mb-4">
                    <h2 class="font-calibre text-3xl font-semibold mb-1">
                        {{ userStore.userName || 'User' }}
                    </h2>
                    <p class="text-base text-gray-500 font-calibre">{{ userStore.userEmail }}</p>
                </div>
                <div class="w-full text-left space-y-4 mt-6 px-4">
                    <div class="flex items-center border-b pb-2">
                        <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 mr-3 text-cbre-green" />
                        <div class="flex justify-between w-full">
                            <span class="font-medium text-gray-500 w-24">{{ $t('company') }}</span>
                            <span class="text-gray-900 font-semibold">{{ profile?.company || '-'}}</span>
                        </div>
                    </div>
                    <div class="flex items-center border-b pb-2">
                        <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-3 text-cbre-green" />
                        <div class="flex justify-between w-full">
                            <span class="font-medium text-gray-500 w-24">{{ $t('branch') }}</span>
                            <span class="text-gray-900 font-semibold">{{ profile?.branch || '-'}}</span>
                        </div>
                    </div>
                    <div class="flex items-center border-b pb-2">
                        <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-3 text-cbre-green" />
                        <div class="flex justify-between w-full">
                            <span class="font-medium text-gray-500 w-24">{{ $t('department') }}</span>
                            <span class="text-gray-900 font-semibold">{{
                                profile?.department || '-'
                                }}</span>
                        </div>
                    </div>
                    <div class="flex items-center border-b pb-2">
                        <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 mr-3 text-cbre-green" />
                        <div class="flex justify-between w-full">
                            <span class="font-medium text-gray-500 w-24">{{ $t('title') }}</span>
                            <span class="text-gray-900 font-semibold">{{ profile?.title || '-'
                                }}</span>
                        </div>
                    </div>
                </div>

                <!-- Settings Section -->
                <div class="w-full text-left space-y-4 mt-6 px-4">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center">
                            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mr-3 text-cbre-green" />
                            <span class="font-medium text-gray-500">{{ $t('profile.show_tooltips') }}</span>
                        </div>
                        <USwitch :model-value="uiStore.showTooltips" @update:model-value="uiStore.toggleTooltips" />
                    </div>
                </div>

                <div class="flex justify-between w-full mt-8 gap-3">
                    <UButton block color="primary" variant="outline"
                        class="flex-1 justify-center cbre-button-secondary text-base hover:bg-cbre-green hover:text-white hover:border-cbre-green rounded-none uppercase font-calibre"
                        icon="i-heroicons-pencil-square" @click="isEditModalOpen = true">
                        {{ $t('profile.edit_profile') }}
                    </UButton>

                    <UButton v-if="['ADMIN', 'DEVELOPER'].includes(userStore.getUserRole || '')" block color="primary" variant="outline"
                        class="flex-1 justify-center cbre-button-secondary text-base hover:bg-cbre-green hover:text-white hover:border-cbre-green rounded-none uppercase font-calibre"
                        icon="i-heroicons-command-line" @click="navigateTo('/admin')">
                        Admin
                    </UButton>

                    <UButton block color="primary" variant="outline"
                        class="flex-1 justify-center cbre-button-primary bg-cbre-primary text-white text-base hover:bg-cbre-accent hover:text-cbre-green ring-0 rounded-none uppercase font-calibre"
                        icon="i-heroicons-arrow-right" @click="handleLogout">
                        {{ $t('logout') }}
                    </UButton>
                </div>
            </div>
        </div>
        
        <!-- Logic for Nested Modal: 
             CommonModal uses Teleport, so nesting conceptually works by stacking Teleports.
             We render the Edit Modal here, and it will teleport on top of the Profile Modal.
        -->
        <NavUserEditProfileModal v-model="isEditModalOpen" :initial-data="currentProfileData"
                :user-name="userStore.userName||''" :user-email="userStore.userEmail||''" :is-loading="isLoading" @save="handleSave" />
    </CommonModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '~/stores/ui'
import { useUserStore } from '~/stores/user'
import { useStatusStore } from '~/stores/status'
import { useAppToast } from '~/composables/useAppToast';
import NavUserEditProfileModal from './EditProfileModal.vue'

const uiStore = useUiStore()
const userStore = useUserStore()
const statusStore = useStatusStore()
const { clear } = useUserSession()
const { showToast } = useAppToast()

// Defensive: Ensure start closed
onMounted(() => {
    if (uiStore.isUserProfileModalOpen) {
        uiStore.toggleUserProfileModal(false)
    }
})

const { isUserProfileModalOpen } = storeToRefs(uiStore)
const { profile } = storeToRefs(userStore)
const { isGlobalLoading } = storeToRefs(statusStore)
const isLoading = computed(() => isGlobalLoading.value)

const isEditModalOpen = ref(false)

interface ProfileType {
    id?: string | null
    userId?: string | null
    imageUrl?: string | null
    company?: string | null
    branch?: string | null
    department?: string | null
    title?: string | null
    useProfileImage?: boolean
}

const currentProfileData = computed<ProfileType>(() => {
    const p = profile.value || {}
    return {
        id: p.id ?? undefined,
        userId: p.userId ?? undefined,
        imageUrl: p.imageUrl ?? undefined,
        company: p.company ?? undefined,
        branch: p.branch ?? undefined,
        department: p.department ?? undefined,
        title: p.title ?? undefined,
        useProfileImage: p.useProfileImage ?? false,
    }
})

const handleClose = () => {
    uiStore.toggleUserProfileModal(false)
}

const handleLogout = async () => {
    uiStore.toggleUserProfileModal(false)
    userStore.$reset()
    await clear()
    navigateTo('/login')
}

const handleSave = async (formData: ProfileType & { name?: string; password?: string }) => {
    statusStore.setGlobalLoading(true)

    try {
        const updatedProfile = await $fetch<ProfileType & { name?: string }>('/api/user/profile', {
            method: 'PUT',
            body: {
                userId: userStore.userId,
                name: formData.name,
                password: formData.password, // Add password to payload
                imageUrl: formData.imageUrl,
                company: formData.company,
                branch: formData.branch,
                department: formData.department,
                title: formData.title,
                useProfileImage: formData.useProfileImage,
            }
        })

        userStore.updateProfile(updatedProfile)

        showToast('Profile updated successfully.', 'success')
        isEditModalOpen.value = false

    } catch (error) {
        console.error(error)
        showToast('Failed to update profile.', 'danger')
    } finally {
        statusStore.setGlobalLoading(false)
    }
}
</script>
