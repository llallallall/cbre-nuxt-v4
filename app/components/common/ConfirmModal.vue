<template>
        <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
                <UCard>
                        <template #header>
                                <div class="flex items-center justify-between">
                                        <h3 class="text-base font-semibold leading-6 text-gray-900">
                                                {{ displayTitle }}
                                        </h3>
                                        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                                                class="-my-1" @click="handleCancel" />
                                </div>
                        </template>

                        <div class="text-center mb-4">
                                <p class="text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {{ displayMessage }}
                                </p>
                        </div>

                        <template #footer>
                                <div class="flex flex-col space-y-3">
                                        <UButton block color="primary" variant="solid" @click="handleConfirm">
                                                {{ displayConfirmText }}
                                        </UButton>
                                        <UButton block color="neutral" variant="solid"
                                                class="border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                @click="handleCancel">
                                                {{ displayCancelText }}
                                        </UButton>
                                </div>
                        </template>
                </UCard>
        </UModal>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
        modelValue: boolean;
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
}>(), {
});

const { t } = useI18n();

const displayTitle = computed(() => props.title || t('confirm_title'));
const displayMessage = computed(() => props.message || t('confirm_message'));
const displayConfirmText = computed(() => props.confirmText || t('confirm_button'));
const displayCancelText = computed(() => props.cancelText || t('cancel_button'));

const emit = defineEmits<{
        (e: 'confirm'): void;
        (e: 'cancel'): void;
        (e: 'update:modelValue', value: boolean): void;
        (e: 'closed'): void;
}>();

const handleConfirm = () => {
        emit('confirm');
};

const handleCancel = () => {
        emit('cancel');
        emit('update:modelValue', false);
};
</script>
