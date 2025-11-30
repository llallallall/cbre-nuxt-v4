// app/composables/useFormat.ts

export const PY_TO_SQM_RATIO = 3.305785; // 1 py = ~3.305785 sqm
export const SQM_TO_PY_RATIO = 1 / PY_TO_SQM_RATIO; // 1 sqm = ~0.3025 py

export const useFormat = () => {

    /**
     * Format number with commas and optional decimals using Intl.NumberFormat
     */
    const numberFormat = (value: number | string | null | undefined, decimals: number = 0): string => {
        if (value === null || value === undefined || value === '') return '';

        const num = Number(value);
        if (isNaN(num)) return '';

        return new Intl.NumberFormat('ko-KR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        }).format(num);
    };

    /**
     * Format number as Integer (0 decimals)
     */
    const formatInt = (value: number | string | null | undefined) => numberFormat(value, 0);

    /**
     * Format number with Decimals (default 2)
     */
    const formatDecimal = (value: number | string | null | undefined, decimals: number = 2) => numberFormat(value, decimals);

    /**
     * Process input for number fields (cleansing and formatting)
     */
    const processNumberInput = (rawValue: string, isDecimal: boolean, decimalPlaces: number = 0) => {
        // 1. Keep only numbers and dot
        let cleanedValue = rawValue.replace(/[^0-9.]/g, '');

        // 2. Handle decimal points
        if (isDecimal) {
            const parts = cleanedValue.split('.');
            if (parts.length > 1) {
                // Ensure only one dot and limit decimal places
                const integerPart = parts[0];
                let decimalPart = parts.slice(1).join('');
                if (decimalPlaces > 0) {
                    decimalPart = decimalPart.slice(0, decimalPlaces);
                }
                cleanedValue = `${integerPart}.${decimalPart}`;
            }
        } else {
            cleanedValue = cleanedValue.replace(/\./g, '');
        }

        // 3. Numeric value for DB
        let numericValue: number | null = null;
        if (cleanedValue !== '' && cleanedValue !== '.') {
            numericValue = Number(cleanedValue);
        }

        // 4. Formatted value for Display
        let formattedValue = '';
        if (cleanedValue !== '') {
            if (cleanedValue.endsWith('.')) {
                formattedValue = Number(cleanedValue.slice(0, -1)).toLocaleString() + '.';
            } else if (cleanedValue === '.') {
                formattedValue = '0.';
            } else {
                const parts = cleanedValue.split('.');
                parts[0] = Number(parts[0]).toLocaleString();
                formattedValue = parts.join('.');
            }
        }

        return {
            cleanedValue,
            formattedValue,
            numericValue
        };
    };

    /**
     * Calculate Py from Sqm
     */
    const calculatePyValue = (sqmValue: number): number => {
        if (!sqmValue || isNaN(sqmValue)) return 0;
        const pyResult = sqmValue * SQM_TO_PY_RATIO;
        return parseFloat(pyResult.toFixed(2));
    };

    /**
     * Format date to YYYY-MM-DD (Local Time)
     * Fixes timezone issue where toISOString() might return previous day
     */
    const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (e) {
            return '';
        }
    };

    /**
     * Convert input to Date object or null
     */
    const toDateOrNull = (date: string | Date | null | undefined): Date | null => {
        if (!date) return null;
        const d = new Date(date);
        return isNaN(d.getTime()) ? null : d;
    };

    /**
     * Format date for display (YYYY.MM.DD)
     */
    const formatDateForDisplay = (date: Date | string | null | undefined): string => {
        if (!date) return '-';
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return '-';
            return new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(d).replace(/\.$/, ''); // Remove trailing dot if present in some locales
        } catch (e) {
            return '-';
        }
    };

    /**
     * Auto-format input to YYYY-MM-DD
     */
    const formatDateInput = (event: Event, dataObject: any, fieldName: string) => {
        const input = event.target as HTMLInputElement;
        let val = input.value.replace(/\D/g, '');

        if (val.length > 8) val = val.substring(0, 8);

        let formatted = '';
        if (val.length > 4) {
            formatted += val.substring(0, 4) + '-';
            if (val.length > 6) {
                formatted += val.substring(4, 6) + '-' + val.substring(6);
            } else {
                formatted += val.substring(4);
            }
        } else {
            formatted = val;
        }

        input.value = formatted;

        const displayField = fieldName + 'Display';
        if (displayField in dataObject) {
            dataObject[displayField] = formatted;
        }

        if (val.length === 8) {
            const year = parseInt(val.substring(0, 4));
            const month = parseInt(val.substring(4, 6));
            const day = parseInt(val.substring(6, 8));
            if (month > 0 && month <= 12 && day > 0 && day <= 31) {
                dataObject[fieldName] = formatted;
            } else {
                dataObject[fieldName] = null;
            }
        } else {
            dataObject[fieldName] = null;
        }
    };

    const displayValue = (value: any, fallback: string = '-'): string => {
        if (value === null || value === undefined || value === '') return fallback;
        return String(value);
    };

    const toDateStringOrEmpty = (dateInput: Date | string | null | undefined): string => {
        if (!dateInput) return '';
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return '';
            // Use local time here as well for consistency
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch {
            return '';
        }
    };

    const calculateYearAndQuarter = (dateString: string) => {
        if (!dateString) return { year: '', quarter: '' };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { year: '', quarter: '' };

        const year = date.getFullYear().toString();
        const month = date.getMonth() + 1;
        const q = Math.ceil(month / 3);

        return { year, quarter: `Q${q}` };
    };

    /**
     * Generate Thumbnail URL (Client-side)
     */
    const getThumbnailUrl = (originalUrl: string | null | undefined): string => {
        if (!originalUrl) return '/images/placeholder.jpg';

        if (originalUrl.includes('/thumb_') || originalUrl.startsWith('/images/')) {
            return originalUrl;
        }

        const ext = originalUrl.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
            return originalUrl;
        }

        try {
            const parts = originalUrl.split('/');
            const fileName = parts.pop();
            if (!fileName) return originalUrl;
            const thumbName = `thumb_${fileName}`;
            return [...parts, thumbName].join('/');
        } catch (e) {
            return originalUrl;
        }
    };

    return {
        numberFormat,
        formatInt,
        formatDecimal,
        processNumberInput,
        calculatePyValue,
        formatDate,
        toDateOrNull,
        formatDateForDisplay,
        formatDateInput,
        displayValue,
        toDateStringOrEmpty,
        calculateYearAndQuarter,
        getThumbnailUrl,
    };
};
