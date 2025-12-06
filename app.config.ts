/// <reference path=".nuxt/nuxt.d.ts" />
export default defineAppConfig({
    ui: {
        colors: {
            primary: 'primary', // tailwind.config.ts에 정의한 'primary' 색상 사용
            gray: 'cool',
        },

        // 버튼 기본 스타일 재정의 (각진 모서리 등)
        button: {
            rounded: 'rounded-none',
            default: {
                size: 'md',
                variant: 'solid',
                color: 'primary'
            }
        },

        // 입력창 기본 스타일 재정의
        input: {
            rounded: 'rounded-none',
            default: {
                size: 'md',
                color: 'gray'
            }
        },

        // 카드 기본 스타일 재정의
        card: {
            rounded: 'rounded-none',
            shadow: 'shadow-sm'
        },

        // 알림(Toast) 스타일 재정의
        notifications: {
            position: 'top-right'
        },

        // Dropdown/Select/Textarea 스타일 재정의
        select: {
            rounded: 'rounded-none',
            default: {
                size: 'md',
                color: 'gray'
            }
        },
        textarea: {
            rounded: 'rounded-none',
            default: {
                size: 'md',
                color: 'gray'
            }
        },
        modal: {
            rounded: 'rounded-none',
            overlay: {
                background: 'bg-gray-900/75'
            }
        }
    }
})