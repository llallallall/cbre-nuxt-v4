// app/stores/status.ts

import { defineStore } from 'pinia';

interface StatusState {
    isGlobalLoading: boolean;
    loadingMessage: string;
    error: string | null;
    errorContext: string | null;
    lastAction: string | null;
    viewerUrl: string | null;
    viewerType: string | null;
    isViewerOpen: boolean;
}

export const useStatusStore = defineStore('status', {
    state: (): StatusState => ({
        isGlobalLoading: false,
        loadingMessage: '',
        error: null,
        errorContext: null,
        lastAction: null,
        viewerUrl: null,
        viewerType: null,
        isViewerOpen: false,
    }),

    getters: {
        isLoading: (state) => state.isGlobalLoading,
    },

    actions: {
        setGlobalLoading(isLoading: boolean, message: string = '') {
            this.isGlobalLoading = isLoading;
            this.loadingMessage = message;
        },

        setGlobalError(error: string, context: string = '') {
            this.error = error;
            this.errorContext = context;
        },

        clearError() {
            this.error = null;
            this.errorContext = null;
        },

        openConfirmModal(message: string, callback: (confirmed: boolean) => void) {
            // This is a placeholder for a real modal implementation
            // In a real app, this would toggle a modal state
            const confirmed = confirm(message);
            callback(confirmed);
        },

        openViewerModal(url: string, type: string) {
            this.viewerUrl = url;
            this.viewerType = type;
            this.isViewerOpen = true;
        },

        closeViewerModal() {
            this.viewerUrl = null;
            this.viewerType = null;
            this.isViewerOpen = false;
        }
    }
});
