/// <reference path="../.nuxt/nuxt.d.ts" />
export default defineAppConfig({
    ui: {
        primary: 'primary',
        gray: 'cool',
        button: {
            defaultVariants: {
                size: 'md',
                variant: 'solid',
                color: 'primary'
            }
        },
        input: {
            defaultVariants: {
                size: 'md',
                color: 'gray'
            }
        },
        card: {
            slots: {
                root: 'shadow-sm'
            }
        },
        // Toast Item Styling
        toast: {
            // color: 'primary'
            slots: {
                // root: 'cbre-toast-root',
                // wrapper: 'cbre-toast-wrapper',
                title: 'cbre-toast-title',
                description: 'cbre-toast-description',
            }
        },
        select: {
            defaultVariants: {
                size: 'md',
                color: 'gray'
            }
        },
        textarea: {
            defaultVariants: {
                size: 'md',
                color: 'gray'
            }
        },
        modal: {
            slots: {
                overlay: 'bg-gray-900/75'
            }
        },
        tooltip: {
            arrow: true,
            delayDuration: 500,
            slots: {
                content: 'text-base font-semibold px-4 py-6 border-b-4 border-accent shadow-lg'
            }
        }
    }
})