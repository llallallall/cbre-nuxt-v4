<template>
        <div class="w-full flex flex-col sm:flex-row items-center justify-between">

                <div class="addresses w-full sm:w-1/2 mb-2 flex flex-col text-base relative">
                        <div v-if="location && location.addressProvince"
                                class="address font-barlow text-cbre-green w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ location.addressProvince }}
                                        <span v-if="location && location.addressCity"> / {{ location.addressCity
                                        }}</span>
                                </div>
                        </div>

                        <div v-if="location && location.addressFull"
                                class="address font-barlow text-cbre-green w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ location.addressFull }}
                                </div>
                        </div>
                </div>

        </div>

        <div class="mt-2">
                <ImageSlide :images="validImages" />
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LocationType, PropertyImageFileType, PropertyBrochureFileType } from '~/types/property.type';
import ImageSlide from '~/components/common/ImageSlide.vue';

const props = defineProps<{
        location: LocationType | null | undefined;
        images: PropertyImageFileType[] | null | undefined;
        brochure: PropertyBrochureFileType[] | null | undefined;
}>();

const validImages = computed(() => {
        if (!props.images) return [];
        return props.images.filter((el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0);
});
</script>

<style scoped>
.action-buttons {
        transition: all 0.2s ease-in-out;
}
</style>
