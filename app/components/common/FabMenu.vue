<template>
    <div ref="fabElement" class="floating-snap-btn-wrapper drop-shadow-xl select-none left"
        :class="uiStore.isFabOpen ? 'fab-active z-100' : 'z-10'">

        <!-- BEGIN :: Floating Button -->
        <div class="fab-btn shadow-md flex justify-center cursor-pointer"
            :class="uiStore.isFabOpen ? 'bg-cbre-green-500/90 delay-300 z-100' : 'bg-cbre-green-500 z-10'">
            <UIcon name="i-ion-add-sharp" :class="uiStore.isFabOpen ? 'rotate-45' : 'rotate-0'"
                class="transition-transform duration-300 w-6 h-6 text-white" />
        </div>
        <!-- BEGIN :: Expand Section -->
        <ul class="fab-menu-ul select-none">
            <li class="fab-menu-li shadow-md bg-white" @click="resetUserSelection" title="Reset Selection">
                <label>Reset</label>
                <UIcon name="i-ion-refresh" class="fab-menu-icon" />
            </li>

            <li class="fab-menu-li shadow-md bg-white" @click="openInfoModal" title="Show Transaction Info">
                <label>Info</label>
                <UIcon name="i-ion-document-text" class="fab-menu-icon" />
            </li>
            <li class="fab-menu-li shadow-md bg-white" @click="uiStore.showMiniMap = !uiStore.showMiniMap"
                title="Toggle Mini Map">
                <label>Toggle</label>
                <UIcon name="i-ion-map" class="fab-menu-icon" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';
import { useUiStore } from '~/stores/ui';
import { usePropertyStore } from '~/stores/property';
import { useAppToast } from '~/composables/useAppToast';
import { useDraggableFab } from '~/composables/useDraggableFab';

const props = defineProps<{
    wrapperElement: HTMLElement | null
}>();

const fabElement = ref<HTMLElement | null>(null);
const wrapperElementRef = toRef(props, 'wrapperElement');

const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const { showToast } = useAppToast();

// Initialize Draggable Logic
useDraggableFab(fabElement, wrapperElementRef);

// Actions
const resetUserSelection = () => {
    propertyStore.resetFilter();
    propertyStore.keptPropertyIds = [];
    propertyStore.filteredPropertyIds = [];
    propertyStore.filteredProperties = propertyStore.initialProperties;
};

const openInfoModal = () => {
    if (propertyStore.keptPropertyIds.length > 0) {
        uiStore.showInfoModal = true;
    } else {
        showToast("There are no properties selected.", 'warning');
    }
};

</script>

<style scoped>
/* ------------------------------------------------ */
/* --- FAB (Floating Action Button) CSS --- */
/* ------------------------------------------------ */

.floating-snap-btn-wrapper {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 45%;
    left: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.floating-snap-btn-wrapper .fab-btn {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    color: white;
    box-shadow: 0px 2px 17px -1px rgba(0, 0, 0, 0.3);
}

.floating-snap-btn-wrapper ul {
    position: relative;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.floating-snap-btn-wrapper ul li {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    list-style-type: none;
    transition: 0.4s;
    transition-property: top, left;
    border-radius: 50%;
}

.floating-snap-btn-wrapper.fab-active li:hover {
    background-color: #17e88f;
    transform: scale(1.1);
}

.floating-snap-btn-wrapper.fab-active.left li:nth-child(1) {
    top: 0%;
    left: 450%;
    transition-delay: 0s;
}

.floating-snap-btn-wrapper.fab-active.left li:nth-child(2) {
    top: 0%;
    left: 300%;
    transition-delay: 0.2s;
}

.floating-snap-btn-wrapper.fab-active.left li:nth-child(3) {
    top: 0%;
    left: 150%;
    transition-delay: 0.4s;
}

.floating-snap-btn-wrapper.fab-active.right li:nth-child(1) {
    top: 0%;
    left: -300%;
    transition-delay: 0s;
}

.floating-snap-btn-wrapper.fab-active.right li:nth-child(2) {
    top: 0%;
    left: -200%;
    transition-delay: 0.2s;
}

.floating-snap-btn-wrapper.fab-active.right li:nth-child(3) {
    top: 0%;
    left: -100%;
    transition-delay: 0.4s;
}

.fab-menu-li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1px;
}

.fab-menu-li label {
    font-size: 8px;
    font-weight: 600;
    color: gray;
}

.fab-menu-li:hover label {
    color: black;
}

.fab-menu-icon {
    color: gray;
    font-size: 18px;
}

.fab-menu-li:hover .fab-menu-icon {
    color: black;
}
</style>
