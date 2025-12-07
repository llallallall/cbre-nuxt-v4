import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import { useUiStore } from '~/stores/ui';

export const useDraggableFab = (fabElement: Ref<HTMLElement | null>, wrapperElement: Ref<HTMLElement | null>) => {
    const uiStore = useUiStore();

    // Fab Menu State
    let oldPositionX: string | undefined;
    let oldPositionY: string | undefined;
    let startMouseX: number = 0;
    let startMouseY: number = 0;
    let offsetX: number = 0;
    let offsetY: number = 0;
    const DRAG_THRESHOLD = 5;

    const move = (e: MouseEvent | TouchEvent) => {
        if (fabElement.value && fabElement.value.style && !fabElement.value.classList.contains("fab-active")) {
            // Prevent scrolling on touch devices
            if (e.type === "touchmove") {
                e.preventDefault();
            }

            let clientX: number, clientY: number;
            if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 0) {
                clientX = e.touches[0]?.clientX || 0;
                clientY = e.touches[0]?.clientY || 0;
            } else if (e instanceof MouseEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else {
                return;
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
            fabElement.value.style.top = (clientY - offsetY - parentOffsetY + fabElement.value.offsetHeight / 2) + "px";
            fabElement.value.style.left = (clientX - offsetX - parentOffsetX + fabElement.value.offsetWidth / 2) + "px";
        }
    };

    const mouseUp = (e: MouseEvent | TouchEvent) => {
        if (e.type === "mouseup") {
            window.removeEventListener("mousemove", move as EventListener);
            window.removeEventListener("mouseup", mouseUp as EventListener);
        } else {
            window.removeEventListener("touchmove", move as EventListener);
            window.removeEventListener("touchend", mouseUp as EventListener);
        }
        snapToSide(e);
        if (fabElement.value && fabElement.value.style) {
            fabElement.value.style.transition = "0.3s ease-in-out left";
        }
    };

    const snapToSide = (e: MouseEvent | TouchEvent) => {
        const windowWidth = window.innerWidth;
        let currPositionX = 0;
        let currPositionY = 0;

        if (window.TouchEvent && e instanceof TouchEvent && e.changedTouches.length > 0) {
            currPositionX = e.changedTouches[0]?.clientX || 0;
            currPositionY = e.changedTouches[0]?.clientY || 0;
        } else if (e instanceof MouseEvent) {
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

    const mouseDown = (e: MouseEvent | TouchEvent) => {
        if (fabElement.value && fabElement.value.style) {
            oldPositionY = fabElement.value.style.top;
            oldPositionX = fabElement.value.style.left;

            const rect = fabElement.value.getBoundingClientRect();

            if (window.MouseEvent && e instanceof MouseEvent) {
                startMouseX = e.clientX;
                startMouseY = e.clientY;
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                window.addEventListener("mousemove", move as EventListener);
                window.addEventListener("mouseup", mouseUp as EventListener);
            } else if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 0) {
                startMouseX = e.touches[0]?.clientX || 0;
                startMouseY = e.touches[0]?.clientY || 0;
                offsetX = (e.touches[0]?.clientX || 0) - rect.left;
                offsetY = (e.touches[0]?.clientY || 0) - rect.top;
                window.addEventListener("touchmove", move as EventListener);
                window.addEventListener("touchend", mouseUp as EventListener);
            }

            fabElement.value.style.transition = "none";
        }
    };

    onMounted(() => {
        if (fabElement.value && fabElement.value.style) {
            const computedStyle = window.getComputedStyle(fabElement.value);
            fabElement.value.style.top = computedStyle.top;
            fabElement.value.style.left = computedStyle.left;

            fabElement.value.addEventListener("mousedown", mouseDown as EventListener);
            fabElement.value.addEventListener("touchstart", mouseDown as EventListener);

            fabElement.value.addEventListener("click", (_e: Event) => {
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
        fabElement.value?.removeEventListener("mousedown", mouseDown as EventListener);
        fabElement.value?.removeEventListener("touchstart", mouseDown as EventListener);
        // Clean up any lingering global listeners
        window.removeEventListener("mousemove", move as EventListener);
        window.removeEventListener("mouseup", mouseUp as EventListener);
        window.removeEventListener("touchmove", move as EventListener);
        window.removeEventListener("touchend", mouseUp as EventListener);
    });

    return {
        // Expose anything if needed, but currently logic is self-contained via side effects (listeners)
    };
};
