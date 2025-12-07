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
                    Register</div>
                <div class="cbre-text-body-md text-white text-lg md:text-xl lg:text-2xl font-light opacity-90 py-0">
                    Property
                    Management
                    System</div>
            </div>

            <!-- Form Section -->
            <div class="bg-black/30 backdrop-blur-md shadow-xl p-6 md:p-8 rounded-b-lg rounded-t-none mt-0">
                <form @submit.prevent="handleSignup" class="flex flex-col space-y-5 md:space-y-6">

                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2">
                            <label class="cbre-text-label-sm font-normal text-white/90 select-none">Name</label>
                            <UInput v-model="name" size="xl" type="text" placeholder="Enter your name" variant="none"
                                class="w-full"
                                :ui="{ base: 'tracking-widest rounded-none bg-white/10 text-white placeholder-gray-400 focus:ring-1 focus:ring-white border border-white/40 focus:border-white/50' }"
                                required />
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="cbre-text-label-sm font-normal text-white/90 select-none">Email</label>
                            <UInput v-model="email" size="xl" type="email" placeholder="Enter your email" variant="none"
                                class="w-full"
                                :ui="{ base: 'tracking-widest rounded-none bg-white/10 text-white placeholder-gray-400 focus:ring-1 focus:ring-white border border-white/40 focus:border-white/50' }"
                                required @blur="validateEmail" id="signup-email" />
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="cbre-text-label-sm font-normal text-white/90 select-none">Password</label>
                            <UInput v-model="password" size="xl" type="password" placeholder="Create a password"
                                variant="none" class="w-full"
                                :ui="{ base: 'tracking-widest rounded-none bg-white/10 text-white placeholder-gray-400 focus:ring-1 focus:ring-white border border-white/40 focus:border-white/50' }"
                                required />
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="cbre-text-label-sm font-normal text-white/90 select-none">Confirm
                                Password</label>
                            <UInput v-model="confirmPassword" size="xl" type="password"
                                placeholder="Confirm your password" variant="none" class="w-full"
                                :ui="{ base: 'tracking-widest rounded-none bg-white/10 text-white placeholder-gray-400 focus:ring-1 focus:ring-white border border-white/40 focus:border-white/50' }"
                                required />
                        </div>
                    </div>

                    <UButton type="submit" block size="xl" :loading="isLoading" :disabled="!isValid" variant="ghost"
                        :ui="{ base: 'rounded-none font-bold uppercase tracking-wider disabled:bg-white disabled:opacity-100 disabled:cursor-not-allowed' }"
                        :class="['mt-4 transition-transform active:scale-[0.98]', isValid ? 'text-white bg-cbre-green hover:bg-cbre-green-light' : 'text-gray-400 ring-1 ring-inset ring-gray-200']">
                        {{ isLoading ? 'Creating Account...' : 'Request Access' }}
                    </UButton>

                    <div class="flex justify-center items-center gap-2 my-2 select-none">
                        <span class="text-gray-300">Already have an account? </span>
                        <NuxtLink to="/login"
                            class="cbre-text-link-underline-slide font-normal text-white cursor-pointer w-fit">
                            Sign In
                        </NuxtLink>
                    </div>

                    <div
                        class="cbre-text-meta font-light text-gray-300/50 my-4 text-justify break-words text-sm md:text-base leading-none select-none">
                        EULA – You acknowledge and agree to use this system for your sole and
                        exclusive benefit only while you are employed in CBRE Korea.
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
const { showToast } = useAppToast();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const emailError = ref('');

// Validation
const isValid = computed(() => {
    const isEmailValid = email.value.trim().length > 0;
    const isNameValid = name.value.trim().length > 0;
    const isPasswordValid = password.value.trim().length > 0;
    const isPasswordMatch = password.value === confirmPassword.value;

    return isEmailValid && isNameValid && isPasswordValid && isPasswordMatch;
});

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showToast('Invalid Email', 'danger', {
            description: 'Please enter in an email format.'
        });
        email.value = '';
        return;
    }

    // 회원가입에서는 이메일이 이미 존재하면 에러
    const exists = await checkEmailExists(email.value);
    if (exists) {
        showToast('Email Exists', 'danger', {
            description: 'This email is already registered. Please sign in.'
        });
        email.value = '';
        emailError.value = 'Email already exists';
    } else {
        emailError.value = '';
    }
};

const handleSignup = async () => {
    if (!isValid.value) {
        if (password.value !== confirmPassword.value) {
            showToast('Password Mismatch', 'warning', {
                description: 'Passwords do not match.'
            });
        }
        return;
    }

    isLoading.value = true;

    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: {
                name: name.value,
                email: email.value,
                password: password.value,
            }
        });

        showToast('Success', 'success', {
            description: 'Account created successfully. Please sign in.'
        });

        router.push('/login');
    } catch (error: any) {
        console.error('Registration Error:', error);
        const errorMsg = error.data?.message || 'Failed to create account.';
        showToast('Registration Failed', 'danger', {
            description: errorMsg
        });
    } finally {
        isLoading.value = false;
    }
}
</script>
