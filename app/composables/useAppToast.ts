export const useAppToast = () => {
    const toast = useToast();

    const showToast = (message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success', options: any = {}) => {
        const color = type === 'danger' ? 'error' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'success';
        const icon = type === 'danger' ? 'i-heroicons-exclamation-circle' :
            type === 'warning' ? 'i-heroicons-exclamation-triangle' :
                type === 'info' ? 'i-heroicons-information-circle' :
                    'i-heroicons-check-circle';

        toast.add({ title: message, color, icon, ...options });
    };

    return {
        showToast
    };
};
