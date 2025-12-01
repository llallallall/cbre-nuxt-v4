<template>
        <UModal :model-value="isUserProfileModalOpen" @update:model-value="handleClose">
                <UCard>
                        <div class="flex flex-col md:flex-row h-full max-h-[85vh] overflow-hidden">
                                <!-- Sidebar -->
                                <div
                                        class="w-full md:w-1/3 min-w-[300px] p-8 bg-gray-50 border-r flex flex-col items-center">
                                        <img :src="userStore.getUserImage || '/images/avatar/avatar-placeholder.png'"
                                                alt="User Avatar"
                                                class="w-32 h-32 rounded-full object-cover border-4 border-cbre-green shadow-md mb-4" />

                                        <h2 class="text-2xl font-semibold text-gray-900 mb-1">{{ userStore.userName ||
                                                'UserName' }}</h2>

                                        <div class="w-full text-left space-y-3 mt-6">
                                                <div class="flex items-center text-sm">
                                                        <UIcon name="i-heroicons-building-office-2"
                                                                class="w-5 h-5 mr-3 text-cbre-green" />
                                                        <span class="font-medium text-gray-500">Company:</span>
                                                        <span class="ml-2 text-gray-900">{{ profile?.company || 'N/A'
                                                        }}</span>
                                                </div>
                                                <div class="flex items-center text-sm">
                                                        <UIcon name="i-heroicons-briefcase"
                                                                class="w-5 h-5 mr-3 text-cbre-green" />
                                                        <span class="font-medium text-gray-500">Department:</span>
                                                        <span class="ml-2 text-gray-900">{{ profile?.department || 'N/A'
                                                        }}</span>
                                                </div>
                                                <div class="flex items-center text-sm">
                                                        <UIcon name="i-heroicons-academic-cap"
                                                                class="w-5 h-5 mr-3 text-cbre-green" />
                                                        <span class="font-medium text-gray-500">Title:</span>
                                                        <span class="ml-2 text-gray-900">{{ profile?.title || 'N/A'
                                                        }}</span>
                                                </div>
                                        </div>

                                        <UButton block color="neutral" variant="solid" class="mt-auto mt-8"
                                                @click="handleLogout">
                                                Logout
                                        </UButton>
                                </div>

                                <!-- Form -->
                                <div class="w-full md:w-2/3 p-8 overflow-y-auto">
                                        <div class="flex justify-between items-center mb-6 border-b pb-2">
                                                <h2 class="text-2xl font-bold text-gray-900">Edit Profile</h2>
                                                <UButton color="neutral" variant="ghost"
                                                        icon="i-heroicons-x-mark-20-solid" @click="handleClose" />
                                        </div>

                                        <form @submit.prevent="handleSave" class="space-y-6">
                                                <UFormGroup label="Name">
                                                        <UInput :model-value="userStore.userName" disabled
                                                                color="neutral" variant="outline" class="bg-gray-100" />
                                                </UFormGroup>

                                                <UFormGroup label="Company">
                                                        <UInput v-model="formProfile.company" />
                                                </UFormGroup>

                                                <UFormGroup label="Department">
                                                        <UInput v-model="formProfile.department" />
                                                </UFormGroup>

                                                <UFormGroup label="Title">
                                                        <UInput v-model="formProfile.title" />
                                                </UFormGroup>

                                                <UCheckbox v-model="formProfile.useProfileImage"
                                                        label="Use custom profile image" />

                                                <div v-if="formProfile.useProfileImage"
                                                        class="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                                                        <p class="text-sm text-gray-500">Image upload feature coming
                                                                soon.</p>
                                                </div>

                                                <div class="flex justify-end pt-4 border-t">
                                                        <UButton type="submit" :loading="isLoading" color="cbre-green"
                                                                variant="solid">
                                                                Save Changes
                                                        </UButton>
                                                </div>
                                        </form>
                                </div>
                        </div>
                </UCard>
        </UModal>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '~/stores/ui'
import { useUserStore } from '~/stores/user'
import { useStatusStore } from '~/stores/status'

import { useAppToast } from '~/composables/useAppToast';

const uiStore = useUiStore()
const userStore = useUserStore()
const statusStore = useStatusStore()
const { clear } = useUserSession()
const { showToast } = useAppToast()

const { isUserProfileModalOpen } = storeToRefs(uiStore)
const { profile } = storeToRefs(userStore)
const { isGlobalLoading } = storeToRefs(statusStore)
const isLoading = computed(() => isGlobalLoading.value)

// Assuming ProfileType is defined somewhere or infer it
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

const formProfile = reactive<ProfileType>({
        id: null,
        userId: null,
        imageUrl: null,
        company: null,
        branch: null,
        department: null,
        title: null,
        useProfileImage: false,
        ...JSON.parse(JSON.stringify(profile.value || {}))
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

const handleSave = async () => {
        statusStore.setGlobalLoading(true)

        try {
                const updatedProfile = await $fetch<ProfileType>('/api/user/profile', {
                        method: 'PUT',
                        body: {
                                userId: userStore.userId,
                                company: formProfile.company,
                                department: formProfile.department,
                                title: formProfile.title,
                                useProfileImage: formProfile.useProfileImage,
                        }
                })

                userStore.updateProfile(updatedProfile)

                showToast('Profile updated successfully.', 'success')
                handleClose()

        } catch (error) {
                console.error(error)
                showToast('Failed to update profile.', 'danger')
        } finally {
                statusStore.setGlobalLoading(false)
        }
}
</script>
