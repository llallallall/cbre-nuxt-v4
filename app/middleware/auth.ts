export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession();

    // 로그인하지 않은 경우 로그인 페이지나 메인으로 튕겨냄
    if (!loggedIn.value) {
        return navigateTo('/');
    }
});