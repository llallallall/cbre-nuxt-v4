export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession();

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!loggedIn.value) {
        return navigateTo('/login');
    }
});