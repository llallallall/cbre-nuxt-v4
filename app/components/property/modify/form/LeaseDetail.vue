<template>
    <CommonModal :model-value="isOpen" :title="isEditMode ? 'Edit Lease Record' : 'Create New Lease Record'" 
        max-width="w-full max-w-5xl" 
        @update:model-value="closeModal" 
        @close="closeModal">
        
        <form @submit.prevent="onSubmit">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-gray-100 pb-4">
                        <UFormGroup label="Lease Type" required>
                                <USelect v-model="formData.leaseType" :options="['ASKING', 'ACTUAL']"
                                        placeholder="Select Lease Type" />
                        </UFormGroup>

                        <UFormGroup label="Execution Date" required>
                                <UInput type="date" v-model="executionDateProxy" />
                        </UFormGroup>

                        <div class="grid grid-cols-2 gap-2">
                                <UFormGroup label="Year">
                                        <UInput type="number" v-model="formData.year" readonly
                                                color="neutral" variant="outline" class="bg-gray-50" />
                                </UFormGroup>
                                <UFormGroup label="Quarter">
                                        <UInput type="text" :model-value="quarterDisplayComputed"
                                                readonly color="neutral" variant="outline"
                                                class="bg-gray-50" />
                                </UFormGroup>
                        </div>

                        <UFormGroup label="Floor">
                                <USelect v-model="formData.floor" :options="floorOptions"
                                        option-attribute="label" value-attribute="value"
                                        placeholder="Select Floor" />
                        </UFormGroup>

                        <UFormGroup label="Unit">
                                <USelect v-model="formData.unit" :options="availableUnits"
                                        :disabled="!formData.floor" placeholder="Select Unit" />
                        </UFormGroup>
                </div>

                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Period & Dates</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-gray-100 pb-4">
                        <UFormGroup label="Lease Term (Year)">
                                <UInput type="number" step="0.1" min="0"
                                        v-model.number="formData.leaseTermYear" />
                        </UFormGroup>
                        <UFormGroup label="Lease Start Date">
                                <UInput type="date" v-model="leaseStartDateProxy" />
                        </UFormGroup>
                        <UFormGroup label="Lease End Date">
                                <UInput type="date" v-model="leaseEndDateProxy" />
                        </UFormGroup>
                </div>

                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Area & Ratio</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b border-gray-100 pb-4">
                        <UFormGroup label="GFA (m²)">
                                <input type="text" :value="getDisplayValue('gfaSqm', 2)"
                                        @input="e => handleNumberInput(e, 'gfaSqm', true, 2)"
                                        placeholder="Gross Floor Area"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="GFA (py)">
                                <input type="text" :value="getDisplayValue('gfaPy', 2)"
                                        @input="e => handleNumberInput(e, 'gfaPy', true, 2)"
                                        placeholder="Gross Floor Area"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="NFA (m²)">
                                <input type="text" :value="getDisplayValue('nfaSqm', 2)"
                                        @input="e => handleNumberInput(e, 'nfaSqm', true, 2)"
                                        placeholder="Net Floor Area"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="NFA (py)">
                                <input type="text" :value="getDisplayValue('nfaPy', 2)"
                                        @input="e => handleNumberInput(e, 'nfaPy', true, 2)"
                                        placeholder="Net Floor Area"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Eff. Ratio (%)">
                                <input type="text" :value="getDisplayValue('effRatio', 2)"
                                        @input="e => handleNumberInput(e, 'effRatio', true, 2)"
                                        placeholder="e.g. 5.50"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                </div>

                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Rent & Deposit</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b border-gray-100 pb-4">
                        <UFormGroup label="Monthly Rent (KRW)">
                                <input type="text" :value="getDisplayValue('monthlyRent', 0)"
                                        @input="e => handleNumberInput(e, 'monthlyRent', true, 0)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Rent Monthly (py)">
                                <input type="text" :value="getDisplayValue('rentMonthlyPy', 0)"
                                        @input="e => handleNumberInput(e, 'rentMonthlyPy', true, 0)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Monthly CAMF (KRW)">
                                <input type="text" :value="getDisplayValue('monthlyCamf', 0)"
                                        @input="e => handleNumberInput(e, 'monthlyCamf', true, 0)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="CAMF Monthly (py)">
                                <input type="text" :value="getDisplayValue('camfMonthlyPy', 0)"
                                        @input="e => handleNumberInput(e, 'camfMonthlyPy', true, 0)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Deposit (KRW)">
                                <input type="text" :value="getDisplayValue('deposit', 0)"
                                        @input="e => handleNumberInput(e, 'deposit', true, 0)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Deposit (py)">
                                <input type="text" :value="getDisplayValue('depositPy', 0)"
                                        @input="e => handleNumberInput(e, 'depositPy', true, 0)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                </div>

                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Indicators & Incentives</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <UFormGroup label="Rent Free Type">
                                <USelect v-model="formData.rentFreeType"
                                        :options="[{ label: 'Per Year', value: 'PerYear' }, { label: 'Per Term', value: 'PerTerm' }]"
                                        placeholder="Select Type" />
                        </UFormGroup>
                        <UFormGroup label="Rent Free Month">
                                <input type="text" :value="getDisplayValue('rentFreeMonth', 0)"
                                        @input="e => handleNumberInput(e, 'rentFreeMonth', true, 0)"
                                        placeholder="Months"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Fit Out">
                                <input type="text" :value="getDisplayValue('fitOut', 0)"
                                        @input="e => handleNumberInput(e, 'fitOut', true, 0)"
                                        placeholder="Number"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="NOC (KRW)">
                                <input type="text" :value="getDisplayValue('noc', 2)"
                                        @input="e => handleNumberInput(e, 'noc', true, 2)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="IOD (KRW)">
                                <input type="text" :value="getDisplayValue('iod', 2)"
                                        @input="e => handleNumberInput(e, 'iod', true, 2)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="GDM (KRW)">
                                <input type="text" :value="getDisplayValue('gdm', 2)"
                                        @input="e => handleNumberInput(e, 'gdm', true, 2)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="Effective NOC (KRW)">
                                <input type="text" :value="getDisplayValue('effectiveNoc', 2)"
                                        @input="e => handleNumberInput(e, 'effectiveNoc', true, 2)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                        <UFormGroup label="TI Amount (KRW)">
                                <input type="text" :value="getDisplayValue('tiAmountKrw', 2)"
                                        @input="e => handleNumberInput(e, 'tiAmountKrw', true, 2)"
                                        placeholder="KRW"
                                        class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cbre-green sm:text-sm sm:leading-6 text-right" />
                        </UFormGroup>
                </div>
        </form>

        <template #footer>
                <div class="flex justify-end space-x-3 w-full">
                        <UButton color="neutral" variant="solid"
                                class="border border-gray-300 text-gray-700 hover:bg-gray-50"
                                @click="closeModal">
                                Cancel
                        </UButton>
                        <UButton color="primary" variant="solid" :loading="computedIsLoading"
                                @click="onSubmit">
                                {{ isEditMode ? 'Save Changes' : 'Create Record' }}
                        </UButton>
                </div>
        </template>
    </CommonModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import type { LeaseType, LeaseCreatePayload } from '~/types/property.type';

import { useAppToast } from '~/composables/useAppToast';

// 1. Store & Composable Init
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { showToast } = useAppToast();
const { numberFormat, processNumberInput, toDateStringOrEmpty, calculateYearAndQuarter } = useFormat();

// Store State
const { currentProperty } = storeToRefs(propertyStore);
const computedIsLoading = computed(() => statusStore.isGlobalLoading);

// 2. Props & Emits
interface Props {
        isOpen: boolean;
        mode: 'create' | 'edit';
        leaseData: LeaseType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'save', payload: LeaseCreatePayload): void;
}>();

const isEditMode = computed(() => props.mode === 'edit');

// 3. Local Form State
interface LocalLeaseForm extends LeaseCreatePayload {
        transactionId?: string;
}

const todayStr = toDateStringOrEmpty(new Date());
const { year: initYear, quarter: initQuarter } = calculateYearAndQuarter(todayStr);

const defaultFormData: LocalLeaseForm = {
        year: initYear,
        quarter: initQuarter,
        executionDate: new Date(),

        leaseType: 'ASKING',
        floor: null,
        unit: null,

        leaseStartDate: null,
        leaseEndDate: null,
        leaseTermYear: null,

        gfaSqm: null, gfaPy: null,
        nfaSqm: null, nfaPy: null,
        effRatio: null,

        monthlyRent: null, monthlyCamf: null, deposit: null,
        rentMonthlyPy: null, camfMonthlyPy: null, depositPy: null,
        iod: null, gdm: null, noc: null,
        effectiveNoc: null, allInNoc: null, allInEffectiveRentMonthlyPy: null,

        rentFreeType: null,
        rentFreeMonth: null,
        fitOut: null,
        tiAmountKrw: null,
        tiAmountNfaPy: null,
        totalFreeRentPeriodMonth: null,
        totalOccupyingPeriodYear: null,
        totalFreeRentOccupyingYear: null,
        monthlyCashSupportGfa: null,
};

const formData = ref<LocalLeaseForm>({ ...defaultFormData });

// Date Proxy
const useDateProxy = (key: 'executionDate' | 'leaseStartDate' | 'leaseEndDate') => computed({
        get: () => toDateStringOrEmpty(formData.value[key]),
        set: (val: string) => {
                (formData.value as any)[key] = val ? new Date(val) : null;
        }
});

const executionDateProxy = useDateProxy('executionDate');
const leaseStartDateProxy = useDateProxy('leaseStartDate');
const leaseEndDateProxy = useDateProxy('leaseEndDate');

// 4. Number Formatting
const displayValues = reactive<Record<string, string>>({});

const getDisplayValue = (field: keyof LeaseCreatePayload, decimals: number) => {
        const key = String(field);
        if (!(key in displayValues)) {
                const val = (formData.value as any)[field];
                displayValues[key] = (val !== null && val !== undefined && val !== '')
                        ? numberFormat(val, decimals)
                        : '';
        }
        return displayValues[key];
};

// Helper type for number fields
type NumberKeys<T> = { [K in keyof T]: NonNullable<T[K]> extends number ? K : never }[keyof T];

const handleNumberInput = (e: Event, field: Exclude<NumberKeys<LeaseCreatePayload>, undefined>, isDecimal: boolean, decimals: number) => {
        const target = e.target as HTMLInputElement;
        const { formattedValue, numericValue } = processNumberInput(target.value, isDecimal, decimals);

        (formData.value as any)[field] = numericValue;
        displayValues[String(field)] = formattedValue;
        target.value = formattedValue;
};

// 5. Floor & Unit Options
const floorOptions = computed(() => {
        return currentProperty.value?.floor?.map(f => ({
                label: `${f.floor}F (${f.type})`,
                value: `${f.floor}_${f.type}`
        })) || [];
});

const availableUnits = computed(() => {
        const selectedFloorValue = formData.value.floor;
        if (!selectedFloorValue) return [];
        const targetFloor = currentProperty.value?.floor?.find(f => `${f.floor}_${f.type}` === selectedFloorValue);
        return targetFloor?.floorPartial?.map(p => p.unitNumber).filter((u): u is string => !!u) || [];
});

watch(() => formData.value.floor, () => {
        formData.value.unit = null;
});

// 6. Date Watcher
watch(() => executionDateProxy.value, (newDateStr) => {
        const { year, quarter } = calculateYearAndQuarter(newDateStr);
        formData.value.year = year;
        formData.value.quarter = quarter;
});

// 7. Data Load
watch(() => props.leaseData, (data) => {
        for (const k in displayValues) delete displayValues[k];

        if (data && isEditMode.value) {
                const source = data as any;
                const execDate = source.executionDate ? new Date(source.executionDate) : new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(execDate));

                formData.value = {
                        ...defaultFormData,
                        ...data,
                        transactionId: data.transactionId || undefined,
                        executionDate: execDate,
                        leaseStartDate: data.leaseStartDate ? new Date(data.leaseStartDate) : null,
                        leaseEndDate: data.leaseEndDate ? new Date(data.leaseEndDate) : null,
                        year: source.year || year,
                        quarter: source.quarter || quarter,
                } as LocalLeaseForm;
        } else {
                const today = new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(today));
                formData.value = {
                        ...defaultFormData,
                        executionDate: today,
                        year,
                        quarter,
                } as LocalLeaseForm;
        }
}, { immediate: true });

const quarterDisplayComputed = computed(() => formData.value.quarter);

// 8. Submit
const onSubmit = () => {
        if (!formData.value.executionDate || !formData.value.leaseType) {
                showToast('Please fill in required fields.', 'warning');
                return;
        }

        const payload: LeaseCreatePayload & { transactionId?: string } = {
                ...formData.value,
                transactionId: isEditMode.value ? props.leaseData?.transactionId || undefined : undefined
        };

        emit('save', payload);
};

const closeModal = () => emit('close');
</script>
