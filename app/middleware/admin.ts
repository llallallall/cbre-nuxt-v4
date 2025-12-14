export default defineNuxtRouteMiddleware(async (to, from) => {
    const { loggedIn, user } = useUserSession();
    const userStore = useUserStore();
    const { showToast } = useAppToast();

    // 1. Not Logged In -> Login Page
    if (!loggedIn.value) {
        return navigateTo('/login');
    }

    // 2. Role Check
    // Ensure user data is loaded in store if it's empty
    if (!userStore.getUserRole && user.value) {
        // Try to sync from session first if possible, or fetch
        await userStore.getUser();
    }

    const role = userStore.getUserRole;

    if (!['ADMIN', 'DEVELOPER'].includes(role || '')) {
        await useUserSession().clear();
        userStore.$reset();
        showToast('Access Denied. Admins only.', 'danger');
        return navigateTo('/login');
    }
});
