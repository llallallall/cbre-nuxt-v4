<template>
    <CommonModal v-model="model" maxWidth="sm:max-w-3xl">
        <div class="bg-white rounded-none w-full font-calibre outline-none">
            <div class="flex justify-between items-center mb-6 border-b pb-2">
                <h2 class="text-3xl text-cbre-green font-bold">{{ $t('profile.edit_profile') }}</h2>
                <!-- <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid text-xl text-black"
                    @click="handleClose" /> -->
            </div>

            <form @submit.prevent="handleSave" class="space-y-6 text-base">
                <div class="flex flex-col sm:flex-row gap-8">
                    <!-- Left Column: Form Fields -->
                    <div class="flex-1 space-y-5">
                        <UFormField :label="$t('name')" class="text-base">
                            <input v-model="form.name" type="text" class="cbre-input" />
                        </UFormField>

                       

                        <div class="py-4 border-t my-4">
                            
                            <div class="space-y-4">
                                <UFormField :label="$t('profile.new_password')" class="text-base">
                                    <input v-model="newPassword" type="password" :placeholder="$t('profile.new_password_placeholder')" 
                                        class="cbre-input" />
                                </UFormField>
                                <UFormField :label="$t('confirm_password')" class="text-base">
                                    <input v-model="confirmPassword" type="password" :placeholder="$t('profile.confirm_password_placeholder')"
                                        class="cbre-input" />
                                </UFormField>
                                <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
                            </div>
                        </div>

                        <div class="pt-4 border-t my-4 space-y-4">

                        <UFormField :label="$t('company')" class="text-base">
                            <input v-model="form.company" type="text" class="cbre-input" />
                        </UFormField>

                        <UFormField :label="$t('branch')" class="text-base">
                            <input v-model="form.branch" type="text" class="cbre-input" />
                        </UFormField>

                        <UFormField :label="$t('department')" class="text-base">
                            <input v-model="form.department" type="text" class="cbre-input" />
                        </UFormField>

                        <UFormField :label="$t('title')" class="text-base">
                            <input v-model="form.title" type="text" class="cbre-input" />
                        </UFormField>
                        </div>
                    </div>

                    <!-- Right Column: Avatar Selection -->
                    <div class="w-full sm:w-80 flex flex-col">
                        <div class="flex-1 space-y-5">
                         <UFormField :label="$t('email')" class="text-base ">
                            <input :value="userEmail" disabled type="text" class="cbre-input" />
                        </UFormField>
                        <div class="pt-4 border-t my-4">
                        <label class="text-base font-medium text-gray-700">{{ $t('profile.profile_image') }}</label>
                        
                        <div class="flex flex-col items-center p-4 bg-gray-50 border border-gray-200 rounded-none">
                            <div class="relative w-64 h-64 mb-4 group">
                                <img :src="currentPreviewImage" 
                                     alt="Profile Preview"
                                     class="w-64 h-64 rounded-full object-cover border-4 border-white shadow-md" />
                            </div>
                            
                            <div class="w-full animate-fade-in">
                                <!-- Manual Tabs Header -->
                                <div class="flex w-full gap-2 mb-2">
                                    <button 
                                        v-for="tab in avatarTabs" 
                                        :key="tab.key"
                                        type="button"
                                        class="flex-1 h-9 whitespace-nowrap transition-all duration-200 text-lg flex items-center justify-center px-1"
                                        :class="activeTab === tab.key 
                                            ? 'cbre-button-primary' 
                                            : 'cbre-button-secondary'"
                                        @click="activeTab = tab.key"
                                    >
                                        {{ tab.label }}
                                    </button>
                                </div>

                                <!-- Manual Tabs Content -->
                                <div class="h-100 overflow-y-auto p-2 border rounded-md bg-white">
                                    <template v-if="activeTab === 'upload'">
                                        <div class="flex flex-col items-center justify-center p-4 text-center h-full border-1 border-dashed border-gray-200 rounded-lg hover:border-cbre-green cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                                @click="triggerImgUpload">
                                            <UIcon name="i-heroicons-cloud-arrow-up" class="w-30 h-30 text-gray-400 mb-2" />
                                            <p class="text-base text-gray-500">
                                                <span class="text-cbre-green font-semibold underline decoration-solid hover:text-cbre-green-dark">{{ $t('profile.upload.click_here') }}</span>
                                                {{ $t('profile.upload.instruction') }}
                                            </p>
                                            <p class="text-base text-gray-400 mt-1">{{ $t('profile.upload.format') }}</p>
                                            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div class="grid grid-cols-3 gap-6">
                                            <div v-for="i in 12" :key="i"
                                                    class="aspect-square rounded-full overflow-hidden border-0 cursor-pointer hover:border-cbre-green transition-colors"
                                                    :class="{'border-cbre-green ring-2 ring-accent ring-offset-2': isSelectedAvatar(activeTab, i)}"
                                                    @click="selectAvatar(activeTab, i)">
                                                <img :src="`/images/avatar/${activeTab}/avatar-${i}.png`" class="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        </div>
                         </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4 border-t gap-3">
                    <UButton block color="primary" variant="outline"
                        class="flex-1 justify-center cbre-button-secondary text-base hover:bg-cbre-green hover:text-white hover:border-cbre-green rounded-none uppercase font-calibre"
                        icon="i-heroicons-x-mark-20-solid" @click="handleClose">
                        {{ $t('cancel_button') }}
                    </UButton>

                    <UButton type="submit" :loading="isLoading"  block color="primary" variant="outline"
                        class="flex-1 justify-center cbre-button-primary bg-cbre-primary text-white text-base hover:bg-cbre-accent hover:text-cbre-green ring-0 rounded-none uppercase font-calibre"
                        icon="i-heroicons-check-20-solid">
                        {{ $t('save_changes') }}
                    </UButton>
                </div>
            </form>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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

const props = defineProps<{
    modelValue: boolean
    initialData: ProfileType
    userName?: string
    userEmail?: string
    isLoading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', data: ProfileType & { name?: string; password?: string }): void
}>()

const { t } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const isAvatarSelectorOpen = ref(false)

// Password management
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

const validatePassword = () => {
    if (newPassword.value && newPassword.value.length < 6) {
        passwordError.value = t('profile.password_min_length')
        return false
    }
    if (newPassword.value !== confirmPassword.value) {
        passwordError.value = t('profile.passwords_do_not_match')
        return false
    }
    passwordError.value = ''
    return true
}

const avatarTabs = computed(() => [
    { label: t('profile.avatar.digital'), key: 'digital', slot: 'avatar-content' },
    { label: t('profile.avatar.office'), key: 'office', slot: 'avatar-content' },
    { label: t('profile.avatar.upload'), key: 'upload', slot: 'avatar-content' }
])
const activeTab = ref('digital')

// Use a computed property for v-model binding
const model = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const form = reactive<ProfileType & { name?: string }>({ ...props.initialData, name: props.userName })
const uploadedPreview = ref<string | null>(null)

// Sync form with initialData
watch(() => props.initialData, (newData) => {
    Object.assign(form, newData)
    // Reset password fields on open/data change
    newPassword.value = ''
    confirmPassword.value = ''
    passwordError.value = ''
    uploadedPreview.value = null 

    // Auto-select tab based on current image
    if (newData.imageUrl?.includes('/images/avatar/digital/')) {
        activeTab.value = 'digital'
    } else if (newData.imageUrl?.includes('/images/avatar/office/')) {
        activeTab.value = 'office'
    } else if (newData.imageUrl) {
         // Custom upload or other
         activeTab.value = 'upload'
    } else {
        // Default
        activeTab.value = 'digital'
    }
}, { deep: true, immediate: true })

const currentPreviewImage = computed(() => {
    if (uploadedPreview.value) return uploadedPreview.value
    // If it's a selected avatar path or external URL
    if (form.imageUrl) return form.imageUrl
    return '/images/avatar/avatar-placeholder.png'
})

const isSelectedAvatar = (category: string, index: number) => {
    return form.imageUrl === `/images/avatar/${category}/avatar-${index}.png`
}

const selectAvatar = (category: string, index: number) => {
    form.imageUrl = `/images/avatar/${category}/avatar-${index}.png`
    form.useProfileImage = true 
    uploadedPreview.value = null
}

const triggerImgUpload = () => {
    fileInput.value?.click()
}
const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                const result = e.target.result as string
                uploadedPreview.value = result
                form.imageUrl = result
                form.useProfileImage = true
            }
        }
        reader.readAsDataURL(file)
    }
}

const handleClose = () => {
    emit('update:modelValue', false)
    isAvatarSelectorOpen.value = false
    uploadedPreview.value = null
}

const handleSave = () => {
    if (newPassword.value) {
        if (!validatePassword()) return
        emit('save', { ...form, password: newPassword.value })
    } else {
        emit('save', { ...form })
    }
}
</script>
