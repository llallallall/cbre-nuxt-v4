<template>
    <main class="w-full h-full flex flex-col items-center justify-center p-4">
        <div class="z-50 absolute top-0 w-full max-w-[1200px] flex justify-between h-[80px] md:h-[100px] p-4 md:p-0">
            <div class="relative md:pt-[30px] md:pl-[40px]">
                <IconCBRELogo class="text-white w-[110px] h-[40px] md:w-[140px] md:h-[50px]" />
            </div>
            <div class="relative md:pt-[30px] md:pr-[40px]">
                <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-white" />
            </div>
        </div>

        <div class="flex flex-col w-full max-w-[400px] z-50 gap-0">
            <!-- Header Section -->
            <div class="cbre-font-calibre text-center backdrop-blur-md bg-white/5 py-6 px-4 select-none rounded-t-lg">
                <div
                    class="cbre-text-display-1 font-mono text-white text-3xl md:text-5xl lg:text-6xl tracking-wider font-bold pt-0 pb-2 md:pb-4">
                    Sign In</div>
                <div class="cbre-text-body-md text-white text-lg md:text-xl lg:text-2xl font-light opacity-90 py-0">
                    Property
                    Management
                    System</div>
            </div>

            <!-- Form Section -->
            <div class="bg-black/30 backdrop-blur-md shadow-xl p-6 md:p-8 rounded-b-lg rounded-t-none mt-0">
                <form @submit.prevent="handleLogin" class="flex flex-col space-y-5 md:space-y-6">

                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2">
                            <label class="cbre-text-label-sm font-normal text-white/90 select-none">Email</label>
                            <UInput v-model="email" size="xl" type="email" placeholder="Enter your email" variant="none"
                                class="w-full"
                                :ui="{ base: 'tracking-widest rounded-none bg-white/10 text-white placeholder-gray-400 focus:ring-1 focus:ring-white border border-white/40 focus:border-white/50' }"
                                required @blur="validateEmail" id="login-email" />

                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="cbre-text-label-sm font-normal text-white/90 select-none">Password</label>
                            <UInput v-model="password" size="xl" type="password" placeholder="Enter your password"
                                variant="none" class="w-full"
                                :ui="{ base: 'tracking-widest rounded-none bg-white/10 text-white placeholder-gray-400 focus:ring-1 focus:ring-white border border-white/40 focus:border-white/50' }"
                                required />
                        </div>
                    </div>

                    <!-- Toast notifications used instead of inline error messages -->

                    <UButton type="submit" block size="xl" :loading="isLoading" :disabled="!isValid" variant="ghost"
                        :ui="{ base: 'rounded-none font-bold uppercase tracking-wider disabled:bg-white disabled:opacity-100 disabled:cursor-not-allowed' }"
                        :class="['mt-4 transition-transform active:scale-[0.98]', isValid ? 'text-white bg-cbre-green hover:bg-cbre-green-light' : 'text-gray-400 ring-1 ring-inset ring-gray-200']">
                        {{ isLoading ? 'Signing in...' : 'Sign In' }}
                    </UButton>

                    <div class="flex justify-center items-center gap-2 my-2 select-none">
                        <span class="text-gray-300">New to System? </span>
                        <NuxtLink to="/signup"
                            class="cbre-text-link-underline-slide font-normal text-white cursor-pointer w-fit">
                            Request Access
                        </NuxtLink>
                    </div>

                    <div
                        class="cbre-text-meta font-light text-gray-300/50 my-4 text-justify break-words text-sm md:text-base leading-none select-none">
                        EULA – You acknowledge and agree to use this system for your sole and
                        exclusive benefit only while you are employed in CBRE Korea. You do not
                        own or have any ownership to any of the data in the system and the data
                        may not be assigned and /or transferred.
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
    layout: 'auth-layout',
    middleware: defineNuxtRouteMiddleware((to, from) => {
        const { loggedIn } = useUserSession()
        if (loggedIn.value) {
            return navigateTo('/')
        }
    }),
});

const router = useRouter();
const { fetch: refreshSession } = useUserSession();
const { showToast } = useAppToast();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const emailError = ref('');

// Validation
const isValid = computed(() => {
    return email.value.trim().length > 0 && password.value.trim().length > 0;
});

const handleLogin = async () => {
    if (!isValid.value || emailError.value) return;

    isLoading.value = true;
    errorMessage.value = '';

    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value,
            }
        });



        showToast('Success', 'success', {
            description: 'Signed in successfully'
        });

        try {
            await refreshSession();
        } catch (sessionErr) {
            console.error('Session refresh failed:', sessionErr);
            showToast('Warning', 'warning', {
                description: 'Session refresh failed, but login succeeded.'
            });
        }

        router.push('/');
    } catch (error: any) {
        console.error('Full Login Error object:', error);
        errorMessage.value = error.data?.message || 'Invalid email or password.';

        showToast('Login Failed', 'danger', {
            description: errorMessage.value
        });
    } finally {
        isLoading.value = false;
    }
}

// 이메일 존재 여부 체크

const checkEmailExists = async (emailStr: string) => {
    try {
        const exists = await $fetch<boolean>(`/api/auth/checkemail?email=${emailStr}`);
        return exists;
    } catch (e) {
        return false;
    }
};

const validateEmail = async () => {
    if (!email.value) {
        emailError.value = '';
        return;
    }

    // 기본 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showToast('Invalid Email', 'danger', {
            description: 'Please enter in an email format.'
        });

        email.value = '';
        setTimeout(() => {
            const inputEl = document.getElementById('login-email');
            if (inputEl) inputEl.focus();
        }, 10);

        return;
    }

    const exists = await checkEmailExists(email.value);
    if (!exists) {
        showToast('Invalid Email', 'danger', {
            description: 'The email address you entered does not exist.'
        });
    } else {
        emailError.value = '';
    }
};
</script>
