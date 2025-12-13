<template>
    <Teleport to="body">
        <Transition name="common-modal-fade">
            <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                :class="wrapperClass"
                role="dialog" aria-modal="true">
                
                <!-- Backdrop -->
                <div class="fixed inset-0 top-[0rem] bg-black/25 transition-opacity pointer-events-auto" aria-hidden="true" @click="close"></div>

                <!-- Modal Panel -->
                <div class="relative transform overflow-hidden bg-white shadow-xl transition-all pointer-events-auto flex flex-col"
                    :class="[maxWidthClass, fullscreen ? '' : 'rounded-lg sm:my-8']">
                    
                    <!-- Header (Optional) -->
                    <div v-if="title" class="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{{ title }}</h3>
                        <button type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none" @click="close">
                            <span class="sr-only">Close</span>
                            <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Close button if no header but still dismissible via UI -->
                    <div v-else class="absolute top-4 right-4 z-20">
                         <button type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none" @click="close">
                            <span class="sr-only">Close</span>
                             <UIcon name="i-heroicons-x-mark" class="h-8 w-8 font-bold text-primary" size="2xl"/>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="px-4 py-5 sm:p-6">
                        <slot />
                    </div>

                    <!-- Footer -->
                    <div v-if="$slots.footer" class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    maxWidth: {
        type: String,
        default: 'sm:max-w-lg' // Default width
    },
    fullscreen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'close']);

const maxWidthClass = computed(() => {
    return props.fullscreen ? 'w-full h-full !my-0 !rounded-none' : props.maxWidth;
});

const wrapperClass = computed(() => {
    return props.fullscreen ? '!p-0' : 'p-4 sm:p-6';
});

const close = () => {
    emit('update:modelValue', false);
    emit('close');
};
</script>

<style scoped>
.common-modal-fade-enter-active,
.common-modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.common-modal-fade-enter-from,
.common-modal-fade-leave-to {
    opacity: 0;
}

.common-modal-fade-enter-active .relative,
.common-modal-fade-leave-active .relative {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.common-modal-fade-enter-from .relative,
.common-modal-fade-leave-to .relative {
    opacity: 0;
    transform: scale(0.95);
}
</style>
