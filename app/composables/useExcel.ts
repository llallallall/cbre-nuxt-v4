// app/composables/useExcel.ts

import { ref, computed } from 'vue';
import type { PropertyType } from '~/types/property.type';
import { useStatusStore } from '~/stores/status';

// --- Type Definitions ---
export type Column = { value: string; text: string; };
export type ExcelColumn = { header: string; key: string; width?: number; required?: boolean };

export type SheetData = {
    name: string;
    columns: Column[];
    rows: any[];
    errors: string[];
};

export const useExcel = () => {
    const statusStore = useStatusStore();
    const toast = useToast();

    // --- State ---
    const file = ref<File | string>('');
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const sheetsData = ref<SheetData[]>([]);
    const activeSheetIndex = ref(0);

    // --- Computed ---
    const isDisabled = computed(() => !file.value);
    const totalErrors = computed(() => sheetsData.value.reduce((acc, sheet) => acc + sheet.errors.length, 0));
    const totalValidRows = computed(() => sheetsData.value.reduce((acc, sheet) => acc + sheet.rows.length, 0));
    const hasCriticalErrors = computed(() => totalErrors.value > 0);

    // --- Column Definitions (Simplified for brevity, ensure full mapping matches requirements) ---
    const SHEET_COLUMNS: Record<string, ExcelColumn[]> = {
        'General Info': [
            { header: 'Ref_ID', key: 'refId', width: 15, required: true },
            { header: 'Property Name', key: 'name', width: 35, required: true },
            // ... Add other columns as needed from reference
        ],
        // ... Add other sheets
    };

    const resetUpload = () => {
        file.value = '';
        sheetsData.value = [];
        activeSheetIndex.value = 0;
        if (fileInputRef.value) fileInputRef.value.value = '';
    }

    const downloadExcel = async (properties: any[]) => {
        statusStore.setGlobalLoading(true, 'downloadExcel');
        try {
            // 💡 Dynamic Import for Performance
            const ExcelJS = (await import('exceljs')).default;
            const FileSaver = (await import('file-saver')).default;

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'CBRE';
            workbook.created = new Date();

            // Example: General Info Sheet
            const sheet = workbook.addWorksheet('General Info');
            sheet.columns = [
                { header: 'Ref_ID', key: 'id', width: 20 },
                { header: 'Property Name', key: 'name', width: 30 },
                { header: 'Address', key: 'address', width: 40 },
            ];

            properties.forEach(p => {
                sheet.addRow({
                    id: p.id,
                    name: p.name,
                    address: p.location?.addressFull || ''
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, `CBRE_Property_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);

            toast.add({ title: 'Excel download completed', color: 'success', icon: 'i-heroicons-check-circle' });

        } catch (error) {
            console.error('Download failed:', error);
            toast.add({ title: 'Failed to download Excel', color: 'error', icon: 'i-heroicons-exclamation-circle' });
        } finally {
            statusStore.setGlobalLoading(false);
        }
    };

    return {
        downloadExcel,
        resetUpload,
        file,
        fileInputRef,
        sheetsData,
        isDisabled
    };
};
