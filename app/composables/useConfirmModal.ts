import { useConfirmStore } from '~/stores/confirm';

export const useConfirmModal = () => {
        const store = useConfirmStore();

        const show = (options: { title?: string; message?: string; confirmText?: string; cancelText?: string }) => {
                return store.open(options);
        };

        return {
                show
        };
};
