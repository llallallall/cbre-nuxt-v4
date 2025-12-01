<template>
        <div>
                <form @submit.prevent="onSubmit" class="space-y-6 font-financier">
                        <div class="grid grid-cols-2 gap-4">
                                <div class="relative w-full">
                                        <label for="city"
                                                class="block text-base font-semibold text-primary mb-2">City</label>
                                        <input id="city" type="text"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.addressCity" />
                                </div>
                                <div class="relative w-full">
                                        <label for="province"
                                                class="block text-base font-semibold text-primary mb-2">Province</label>
                                        <input id="province" type="text"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.addressProvince" />
                                </div>
                        </div>

                        <div class="relative w-full">
                                <label for="addressFull" class="block text-base font-semibold text-primary mb-2">Full
                                        Address</label>
                                <div class="flex gap-2">
                                        <input id="addressFull" type="text"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.addressFull" />
                                        <button type="button" @click="onSearchAddress"
                                                class="mt-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition duration-150 whitespace-nowrap">
                                                Search Coords
                                        </button>
                                </div>
                        </div>

                        <div class="relative w-full">
                                <label for="addressFullJibun"
                                        class="block text-base font-semibold text-primary mb-2">Jibun
                                        Address</label>
                                <input id="addressFullJibun" type="text"
                                        class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
                                        v-model="formData.addressFullJibun" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                                <div class="relative w-full">
                                        <label for="latitude"
                                                class="block text-base font-semibold text-primary mb-2">Latitude</label>
                                        <input id="latitude" type="number" step="any"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
                                                v-model.number="formData.latitude" />
                                </div>
                                <div class="relative w-full">
                                        <label for="longitude"
                                                class="block text-base font-semibold text-primary mb-2">Longitude</label>
                                        <input id="longitude" type="number" step="any"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
                                                v-model.number="formData.longitude" />
                                </div>
                        </div>

                        <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
                                <button type="button" @click="emit('close')"
                                        class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
                                <button type="submit" :disabled="computedIsLoading"
                                        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
                        </div>
                </form>
        </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useAddressProcessor } from '~/composables/useAddressProcessor';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { showToast } = useAppToast();
const { searchAddressCandidates, processSelectedAddress } = useAddressProcessor();

const getInitialData = () => {
        return {
                addressCity: currentProperty.value?.location?.addressCity || '',
                addressProvince: currentProperty.value?.location?.addressProvince || '',
                addressFull: currentProperty.value?.location?.addressFull || '',
                addressFullJibun: currentProperty.value?.location?.addressFullJibun || '',
                latitude: currentProperty.value?.location?.latitude || null,
                longitude: currentProperty.value?.location?.longitude || null,
        };
};

const formData = reactive(getInitialData());

const onSearchAddress = async () => {
        if (!formData.addressFull) {
                showToast('Please enter a Full Address to search.', 'warning');
                return;
        }

        statusStore.setGlobalLoading(true);
        try {
                const candidates = await searchAddressCandidates(formData.addressFull);

                if (candidates.length === 0) {
                        showToast('No address found.', 'warning');
                } else {
                        // For simplicity, pick the first candidate or show a modal if needed.
                        // Here we assume the first one is the best match.
                        const bestMatch = candidates[0];
                        if (!bestMatch) {
                                showToast('No valid address candidate found.', 'warning');
                                return;
                        }
                        const details = await processSelectedAddress(bestMatch);

                        if (details) {
                                formData.addressCity = details.addressCity || formData.addressCity;
                                formData.addressProvince = details.addressProvince || formData.addressProvince;
                                formData.latitude = details.latitude;
                                formData.longitude = details.longitude;
                                // Optional: Update full address if the result is more accurate
                                // formData.addressFull = details.addressFull; 

                                showToast('Coordinates updated from address.', 'success');
                        } else {
                                showToast('Failed to process address details.', 'danger');
                        }
                }
        } catch (e) {
                console.error(e);
                showToast('Error searching address.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};

const onSubmit = async () => {
        statusStore.setGlobalLoading(true);
        try {
                await propertyStore.updatePropertySection('location', formData as any);
                emit('close');
                showToast('Location saved.', 'success');
        } catch (e) {
                showToast('Error saving location.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>
