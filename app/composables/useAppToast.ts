export const useAppToast = () => {
    const toast = useToast();

    const showToast = (message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success', options: any = {}) => {
        const color = type === 'danger' ? 'error' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'success';
        const icon = type === 'danger' ? 'i-heroicons-exclamation-circle' :
            type === 'warning' ? 'i-heroicons-exclamation-triangle' :
                type === 'info' ? 'i-heroicons-information-circle' :
                    'i-heroicons-check-circle';

        toast.add({
            title: message,
            color,
            icon,
            ui: {
                title: 'cbre-toast-title font-medium text-gray-900 dark:text-white',
                description: 'mt-1 cbre-toast-description text-gray-500 dark:text-gray-400'
            },
            ...options
        });
    };

    return {
        showToast
    };
};
