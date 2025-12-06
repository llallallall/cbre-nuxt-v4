<template>
    <div class="w-screen h-screen overflow-hidden">
        <div ref="wrapperElement" class="relative flex w-full h-full flex-col lg:flex-row">

            <div :class="[
                'overflow-hidden transition-all duration-300',
                'w-full lg:w-auto lg:h-[calc(100vh-80px)]',
                uiStore.isHiddenList ? 'h-full lg:w-full' : 'h-[50%] lg:flex-1'
            ]">
                <button v-if="uiStore.isHiddenList" @click="uiStore.isHiddenList = false"
                    class="absolute z-10 bg-white p-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300 animate-fade-in bottom-[20px] right-[20px] top-auto lg:top-[90px] lg:right-[80px] lg:bottom-auto">
                    <UIcon name="i-ph-sidebar-simple" class="w-5 h-5" />
                    <span>Show List</span>
                </button>
                <ClientOnly>
                    <MapContainer />
                </ClientOnly>


            </div>

            <div v-show="!uiStore.isHiddenList" :class="[
                'transition-all duration-300 border-gray-200',
                'w-full h-[50%] border-t lg:h-[calc(100vh-80px)] lg:border-l lg:border-t-0',
                uiStore.isExpandedList ? 'lg:w-[50%]' : 'lg:w-[40%] lg:min-w-[400px] lg:max-w-[600px]'
            ]">
                <ListCard :data="filteredProperties" :totalCount="filteredProperties.length" :itemsPerRender="6"
                    containerClasses="bg-[#f4f7f7] p-2 pt-0 h-full" defaultLoadingColor="#222" />
            </div>

            <div ref="fabElement" class="floating-snap-btn-wrapper drop-shadow-xl select-none left"
                :class="{ 'fab-active': uiStore.isFabOpen }">

                <!-- BEGIN :: Floating Button -->
                <div class="fab-btn shadow-md flex justify-center cursor-pointer"
                    :class="uiStore.isFabOpen ? 'bg-cbre-green-500/90 delay-300' : 'bg-cbre-green-500 '">
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

            <div v-if="uiStore.isFabOpen || uiStore.showInfoModal" @click="closeFabMenu"
                class="backdrop fixed inset-0 top-0 bg-black/10 transition-opacity"
                :class="uiStore.isFabOpen ? 'block z-40' : 'hidden z-0'">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppToast } from '~/composables/useAppToast';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useMapStore } from '~/stores/map';
import MapContainer from '~/components/map/Container.vue';
import ListCard from '~/components/list/Card.vue';

definePageMeta({
    layout: 'default'
});

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const mapStore = useMapStore();

const { filteredProperties } = storeToRefs(propertyStore);
const { mapStyleOptions } = storeToRefs(mapStore);

const wrapperElement = ref<HTMLElement | null>(null);
const fabElement = ref<HTMLElement | null>(null);

onMounted(async () => {
    await propertyStore.fetchInitialData();
});



// Fab Menu
let oldPositionX: any;
let oldPositionY: any;
let startMouseX: number = 0;
let startMouseY: number = 0;
let offsetX: number = 0;
let offsetY: number = 0;
const DRAG_THRESHOLD = 5;

const move = (e: any) => {
    if (fabElement.value && fabElement.value.style && !fabElement.value.classList.contains("fab-active")) {
        // Prevent scrolling on touch devices
        if (e.type === "touchmove") {
            e.preventDefault();
        }

        let clientX, clientY;
        if (e.type === "touchmove") {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (Math.abs(clientX - startMouseX) < DRAG_THRESHOLD && Math.abs(clientY - startMouseY) < DRAG_THRESHOLD) {
            return;
        }

        // Get parent container offset
        let parentOffsetX = 0;
        let parentOffsetY = 0;
        if (wrapperElement.value) {
            const parentRect = wrapperElement.value.getBoundingClientRect();
            parentOffsetX = parentRect.left;
            parentOffsetY = parentRect.top;
        }

        // Calculate position relative to parent
        // Add half width/height to compensate for transform: translate(-50%, -50%)
        fabElement.value.style.top = (clientY - offsetY - parentOffsetY + fabElement.value.offsetHeight / 2) + "px";
        fabElement.value.style.left = (clientX - offsetX - parentOffsetX + fabElement.value.offsetWidth / 2) + "px";
    }
};

const mouseDown = (e: any) => {
    if (fabElement.value && fabElement.value.style) {

        oldPositionY = fabElement.value.style.top;
        oldPositionX = fabElement.value.style.left;
        
        const rect = fabElement.value.getBoundingClientRect();

        if (e.type === "mousedown") {
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", mouseUp);
        } else {
            startMouseX = e.touches[0].clientX;
            startMouseY = e.touches[0].clientY;
            offsetX = e.touches[0].clientX - rect.left;
            offsetY = e.touches[0].clientY - rect.top;
            window.addEventListener("touchmove", move);
            window.addEventListener("touchend", mouseUp);
        }

        fabElement.value.style.transition = "none";
    }
};

const mouseUp = (e: any) => {
    if (e.type === "mouseup") {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", mouseUp);
    } else {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", mouseUp);
    }
    snapToSide(e);
    if (fabElement.value && fabElement.value.style) {
        fabElement.value.style.transition = "0.3s ease-in-out left";
    }

};

const snapToSide = (e: any) => {
    const windowWidth = window.innerWidth;
    let currPositionX = 0;
    let currPositionY = 0;
    if (e.type === "touchend") {
        currPositionX = e.changedTouches[0].clientX;
        currPositionY = e.changedTouches[0].clientY;
    } else {
        currPositionX = e.clientX;
        currPositionY = e.clientY;
    }

    if (fabElement.value && fabElement.value.style && wrapperElement.value) {
        if (currPositionY < 50) {
            fabElement.value.style.top = 50 + "px";
        }
        if (currPositionY > wrapperElement.value.clientHeight - 50) {
            fabElement.value.style.top = wrapperElement.value.clientHeight - 50 + "px";
        }
        if (currPositionX < windowWidth / 2) {
            fabElement.value.style.left = 30 + "px";
            fabElement.value.classList.remove("right");
            fabElement.value.classList.add("left");
        } else {
            fabElement.value.style.left = windowWidth - 30 + "px";
            fabElement.value.classList.remove("left");
            fabElement.value.classList.add("right");
        }
    }
};

onMounted(() => {

    if (fabElement.value && fabElement.value.style) {
        const computedStyle = window.getComputedStyle(fabElement.value);
        fabElement.value.style.top = computedStyle.top;
        fabElement.value.style.left = computedStyle.left;

        if (fabElement.value) {
            fabElement.value.addEventListener("mousedown", mouseDown);
        }

        if (fabElement.value) {
            fabElement.value.addEventListener("touchstart", mouseDown);
        }

        fabElement.value.addEventListener("click", (_e: any) => {

            if (
                oldPositionY === fabElement.value?.style.top &&
                oldPositionX === fabElement.value?.style.left
            ) {
                uiStore.isFabOpen = !uiStore.isFabOpen;
            }
        });

    }

});

onBeforeUnmount(() => {
    fabElement.value?.removeEventListener("mousedown", mouseDown);
    fabElement.value?.removeEventListener("touchstart", mouseDown);
    fabElement.value?.removeEventListener("click", (_e: any) => { });
    
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", mouseUp);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", mouseUp);
});

const { showToast } = useAppToast();

const openInfoModal = () => {
    if (propertyStore.keptPropertyIds.length > 0) {
        uiStore.showInfoModal = true;
    } else {
        showToast("There are no properties selected.", 'warning');
    }
};

const closeInfoModal = () => {
    uiStore.showInfoModal = false;
    uiStore.isFabOpen = false;
};

const closeFabMenu = () => {
    uiStore.isFabOpen = false;
    uiStore.showInfoModal = false;
};

const resetUserSelection = () => {
    propertyStore.resetFilter()
    propertyStore.keptPropertyIds = [];
    propertyStore.filteredPropertyIds = [];
    propertyStore.filteredProperties = propertyStore.initialProperties;
};

const onDownloadExcel = async () => {
}

</script>

<style scoped>
/* ------------------------------------------------ */
/* --- FAB (Floating Action Button) CSS --- */
/* ------------------------------------------------ */

.backdrop {
    display: hidden;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: calc(100% - 80px);
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
}

.floating-snap-btn-wrapper {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 45%;
    left: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    z-index: 50;
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
    z-index: 100;
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

.detail-card-wrapper {
    width: 100%;
    height: 100%;
}

.detail-card-outer {
    width: 100%;
    height: 100%;
}

.detail-card-inner {
    width: 100%;
    height: 100%;
}

.detail-card-contents {
    width: 100%;
    height: 100%;
}

.modalCloseButton {
    position: absolute;
    top: 165px;
    right: 70px;
    z-index: 100;
}

.bulletList {
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 2;
}
</style>
