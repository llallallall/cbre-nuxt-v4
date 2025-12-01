<template>
        <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-primary">Lease Transactions</h3>
                        <button @click="openModal('create')"
                                class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">
                                Add Lease
                        </button>
                </div>

                <div class="overflow-x-auto border border-gray-200 rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 font-financierMedium text-primary text-base">
                                        <tr>
                                                <th class="px-3 py-2 text-left">Execution Date</th>
                                                <th class="px-3 py-2 text-left">Floor / Unit</th>
                                                <th class="px-3 py-2 text-left">Type</th>
                                                <th class="px-3 py-2 text-left">Term</th>
                                                <th class="px-3 py-2 text-left">Start Date</th>
                                                <th class="px-3 py-2 text-left">End Date</th>
                                                <th class="px-3 py-2 text-center">Action</th>
                                        </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200 font-calibreLight text-lg text-primary">
                                        <tr v-for="t in leaseTransactions" :key="t.id">
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        formatDateForDisplay(t.executionDate) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-500">{{
                                                        displayValue(t.lease?.floor) }} / {{ displayValue(t.lease?.unit)
                                                        }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        displayValue(t.lease?.leaseType) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        displayValue(t.lease?.leaseTermYear) }} Years</td>
                                                <td class="px-3 py-2 text-sm text-gray-500">{{
                                                        formatDateForDisplay(t.lease?.leaseStartDate) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-500">{{
                                                        formatDateForDisplay(t.lease?.leaseEndDate) }}</td>
                                                <td class="px-3 py-2 text-sm text-center">
                                                        <button @click="openModal('edit', t)"
                                                                class="text-cbre_primary_1 hover:text-cbre_primary_2 mr-3 font-medium">Edit</button>
                                                        <button @click="confirmDelete(t.id)"
                                                                class="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                                </td>
                                        </tr>
                                        <tr v-if="leaseTransactions.length === 0">
                                                <td colspan="7" class="px-3 py-4 text-center text-sm text-gray-500">No
                                                        lease records found.</td>
                                        </tr>
                                </tbody>
                        </table>
                </div>

                <LeaseDetail :isOpen="isModalOpen" :mode="modalMode" :leaseData="selectedLeaseData" @save="handleSave"
                        @close="closeModal" />
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import { useAppToast } from '~/composables/useAppToast';
import { useConfirmModal } from '~/composables/useConfirmModal';
import type { TransactionType, LeaseType } from '~/types/property.type';

const { formatDateForDisplay, displayValue } = useFormat();
const { showToast } = useAppToast();
const { show: openConfirmModal } = useConfirmModal();

const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);

const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedLeaseData = ref<LeaseType | null>(null); // 紐⑤떖???꾨떖???곗씠??

// Lease 紐⑸줉 ?꾪꽣留?
const leaseTransactions = computed(() => {
        return currentProperty.value?.transaction?.filter(t => t.type === 'LEASE') || [];
});

// openModal ?⑥닔 ?섏젙
const openModal = (mode: 'create' | 'edit', transaction?: TransactionType) => {
        isModalOpen.value = true;
        modalMode.value = mode;

        if (mode === 'edit' && transaction && transaction.lease) {
                // ?뮕 [?섏젙] Transaction???좎쭨 ?뺣낫瑜?Lease ?곗씠?곗뿉 蹂묓빀?섏뿬 ?꾨떖
                selectedLeaseData.value = {
                        ...transaction.lease,
                        // Transaction ?덈꺼???뺣낫 二쇱엯
                        executionDate: transaction.executionDate,
                        year: transaction.year,
                        quarter: transaction.quarter,
                } as any; // LeaseType?먮뒗 ?녿뒗 ?꾨뱶?대?濡?any 罹먯뒪???꾩슂
        } else {
                selectedLeaseData.value = null;
        }
};

const closeModal = () => {
        isModalOpen.value = false;
        selectedLeaseData.value = null;
};

// ????몃뱾??
const handleSave = async (payload: any) => {
        statusStore.setGlobalLoading(true);
        try {
                const propertyId = propertyStore.currentPropertyId;
                const body = {
                        ...payload,
                        type: 'LEASE',
                        propertyId
                };

                if (payload.transactionId) {
                        // Update: PUT /api/property/admin/[id]/lease/[transactionId]
                        await $fetch(`/api/property/admin/${propertyId}/lease/${payload.transactionId}`, {
                                method: 'PUT' as any,
                                body
                        });
                } else {
                        // Create: POST /api/property/admin/[id]/lease
                        await $fetch(`/api/property/admin/${propertyId}/lease`, {
                                method: 'POST' as any,
                                body
                        });
                }

                showToast('Lease record saved.', 'success');
                closeModal();
                // ?곗씠??由щ줈??
                await propertyStore.fetchPropertyDetail(propertyStore.currentPropertyId);

        } catch (error) {
                console.error(error);
                showToast('Failed to save lease record.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};

// ??젣 ?몃뱾??
const confirmDelete = async (id: string) => {
        const confirmed = await openConfirmModal({
                title: 'Delete Lease',
                message: 'Are you sure you want to delete this lease record?',
                confirmText: 'Delete'
        });

        if (!confirmed) return;

        statusStore.setGlobalLoading(true);
        try {
                // API ?몄텧
                const propertyId = propertyStore.currentPropertyId;
                await $fetch(`/api/property/admin/${propertyId}/lease/${id}`, { method: 'DELETE' });

                // Store 媛깆떊 (由щ줈??
                await propertyStore.fetchPropertyDetail(propertyStore.currentPropertyId);
                showToast('Lease record deleted.', 'success');
        } catch (error) {
                showToast('Failed to delete.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>
