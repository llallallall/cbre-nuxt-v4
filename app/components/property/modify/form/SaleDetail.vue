<template>
        <!-- Transaction Details -->
        <fieldset class="border border-gray-200 p-4 rounded-lg space-y-4">
                <legend class="text-sm font-semibold text-gray-600 px-2">Transaction Details
                </legend>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <UFormGroup label="Execution Date" required>
                                <UInput type="date" v-model="executionDateProxy" />
                        </UFormGroup>
                        <UFormGroup label="Price / GFA">
                                <input type="text" :value="getDisplayValue('pricePerGfa', 0)"
                                        @input="e => handleNumberInput(e, 'pricePerGfa', false, 0)"
                                        placeholder="KRW per m² GFA"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Price / NFA">
                                <input type="text" :value="getDisplayValue('pricePerNfa', 0)"
                                        @input="e => handleNumberInput(e, 'pricePerNfa', false, 0)"
                                        placeholder="KRW per m² NFA"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                </div>
        </fieldset>

        <!-- Rates & Parties -->
        <fieldset class="border border-gray-200 p-4 rounded-lg space-y-4">
                <legend class="text-sm font-semibold text-gray-600 px-2">Rates & Parties
                </legend>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UFormGroup label="Est. Cap Rate (%)">
                                <input type="text" :value="getDisplayValue('estCapRate', 2)"
                                        @input="e => handleNumberInput(e, 'estCapRate', true, 2)" placeholder="e.g. 5.5"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Est. Discount Rate (%)">
                                <input type="text" :value="getDisplayValue('estDiscountRate', 2)"
                                        @input="e => handleNumberInput(e, 'estDiscountRate', true, 2)"
                                        placeholder="e.g. 5.5"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UFormGroup label="Buyer">
                                <UInput v-model="formData.buyer" />
                        </UFormGroup>
                        <UFormGroup label="Seller">
                                <UInput v-model="formData.seller" />
                        </UFormGroup>
                </div>
        </fieldset>

        <UFormGroup label="Remarks">
                <UTextarea v-model="formData.remarks" :rows="3" />
        </UFormGroup>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import type { SaleType, SaleCreatePayload } from '~/types/property.type';
import { usePropertyStore } from '~/stores/property';
import { useFormat } from '~/composables/useFormat';

import { useAppToast } from '~/composables/useAppToast';

const { numberFormat, processNumberInput, toDateStringOrEmpty, calculateYearAndQuarter } = useFormat();
const { showToast } = useAppToast();

interface Props {
        isOpen: boolean;
        saleData: SaleType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'save', payload: SaleCreatePayload): void;
}>();

const isEditMode = computed(() => !!props.saleData?.transactionId);
const propertyStore = usePropertyStore();
const { currentProperty } = storeToRefs(propertyStore);

// 1. Local Form Type
interface LocalSaleForm extends Omit<SaleCreatePayload, 'remarks'> {
        remarks: string;
        transactionId?: string;
}

// Init
const today = new Date();
const { year: initYear, quarter: initQuarter } = calculateYearAndQuarter(toDateStringOrEmpty(today));

const defaultFormData: LocalSaleForm = {
        year: initYear,
        quarter: initQuarter,
        executionDate: today,
        saleType: 'ENBLOC',
        gfaSqm: null, nfaSqm: null, priceKrw: null, pricePerGfa: null, pricePerNfa: null,
        estCapRate: null, estDiscountRate: null, buyer: null, seller: null, remarks: '',
};

const formData = ref<LocalSaleForm>({ ...defaultFormData });
const displayValues = reactive<Record<string, string>>({});

// 2. Date Proxy
const executionDateProxy = computed({
        get: () => toDateStringOrEmpty(formData.value.executionDate),
        set: (val: string) => {
                formData.value.executionDate = val ? new Date(val) : new Date();
        }
});

// 3. Quarter Display
const quarterDisplayComputed = computed(() => {
        return formData.value.quarter || '';
});

// Number Input
const getDisplayValue = (field: keyof SaleCreatePayload, decimals: number) => {
        const key = String(field);
        if (!(key in displayValues)) {
                const val = formData.value[field as keyof LocalSaleForm];
                if (typeof val === 'number') {
                        displayValues[key] = numberFormat(val, decimals);
                } else {
                        displayValues[key] = '';
                }
        }
        return displayValues[key];
};

const handleNumberInput = (e: Event, field: keyof SaleCreatePayload, isDecimal: boolean, decimals: number) => {
        const target = e.target as HTMLInputElement;
        const { formattedValue, numericValue } = processNumberInput(target.value, isDecimal, decimals);
        (formData.value as any)[field] = numericValue;
        displayValues[String(field)] = formattedValue;
        target.value = formattedValue;
};

// Helper: Unit Price Calc
const calculateUnitPrice = (price: number | null | undefined, area: number | null | undefined): number | null => {
        if (price === null || price === undefined || area === null || area === undefined || area === 0) {
                return null;
        }
        return Math.round(price / area);
};

// Watchers
watch(() => executionDateProxy.value, (newDateStr) => {
        const { year, quarter } = calculateYearAndQuarter(newDateStr);
        formData.value.year = year;
        formData.value.quarter = quarter;
});

watch(() => formData.value.saleType, (newSaleType) => {
        if (newSaleType === 'ENBLOC') {
                const scale = currentProperty.value?.scale;
                const round2 = (n: number | null | undefined) => n ? parseFloat(n.toFixed(2)) : null;

                formData.value.gfaSqm = round2(scale?.gfaSqm);
                formData.value.nfaSqm = round2(scale?.nfaSqm);
        }
        delete displayValues['gfaSqm'];
        delete displayValues['nfaSqm'];
});

watch(
        () => [formData.value.priceKrw, formData.value.gfaSqm, formData.value.nfaSqm],
        ([price, gfa, nfa]) => {
                const newPricePerGfa = calculateUnitPrice(price as number, gfa as number);
                formData.value.pricePerGfa = newPricePerGfa;
                const newPricePerNfa = calculateUnitPrice(price as number, nfa as number);
                formData.value.pricePerNfa = newPricePerNfa;
                displayValues['pricePerGfa'] = numberFormat(newPricePerGfa, 0);
                displayValues['pricePerNfa'] = numberFormat(newPricePerNfa, 0);
        }
);

watch(() => props.saleData, (data) => {
        for (const key in displayValues) delete displayValues[key];

        if (data && isEditMode.value) {
                const source = data as any;
                const execDate = source.executionDate ? new Date(source.executionDate) : new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(execDate));

                formData.value = {
                        ...defaultFormData,
                        ...data,
                        transactionId: data.transactionId || undefined,
                        executionDate: execDate,
                        year: source.year || year,
                        quarter: source.quarter || quarter,
                        remarks: data.remarks || '',
                } as LocalSaleForm;
        } else {
                const now = new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(now));
                const round2 = (n: number | null | undefined) => n ? parseFloat(n.toFixed(2)) : null;

                formData.value = {
                        ...defaultFormData,
                        executionDate: now,
                        year, quarter,
                        gfaSqm: round2(currentProperty.value?.scale?.gfaSqm),
                        nfaSqm: round2(currentProperty.value?.scale?.nfaSqm)
                } as LocalSaleForm;
        }
}, { immediate: true });

const closeModal = () => emit('close');

const onSubmit = () => {
        if (!formData.value.executionDate || !formData.value.saleType) {
                showToast('Please fill in required fields.', 'warning');
                return;
        }
        const payload: SaleCreatePayload & { transactionId?: string } = {
                ...formData.value,
                remarks: formData.value.remarks || null,
                transactionId: isEditMode.value ? props.saleData?.transactionId || undefined : undefined
        } as any;

        emit('save', payload);
};
</script>
