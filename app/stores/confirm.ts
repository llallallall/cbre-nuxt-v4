import { defineStore } from 'pinia';

interface ConfirmOptions {
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
}

export const useConfirmStore = defineStore('confirm', {
        state: () => ({
                isOpen: false,
                options: {
                        title: 'Confirm',
                        message: 'Are you sure?',
                        confirmText: 'Confirm',
                        cancelText: 'Cancel',
                } as ConfirmOptions,
                resolve: null as ((value: boolean) => void) | null,
        }),
        actions: {
                open(options: ConfirmOptions) {
                        this.options = { ...this.options, ...options };
                        this.isOpen = true;
                        return new Promise<boolean>((resolve) => {
                                this.resolve = resolve;
                        });
                },
                confirm() {
                        this.isOpen = false;
                        if (this.resolve) this.resolve(true);
                        this.resolve = null;
                },
                cancel() {
                        this.isOpen = false;
                        if (this.resolve) this.resolve(false);
                        this.resolve = null;
                }
        }
});
