export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie('authUser');
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login', { replace: true });
  }
  if (user.value && to.path === '/login') {
    return navigateTo('/', { replace: true });
  }
});
