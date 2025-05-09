// middleware/auth.ts
import { useAuth } from '~/composables/useAuth';
import { navigateTo, defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isAuthenticated, fetchUser } = useAuth();
  let userFetched = false;

  if (user.value === undefined || user.value === null) {
    try {
      await fetchUser();
      userFetched = true;
    } catch (fetchErr) {
      console.error("Error fetching user state in middleware:", fetchErr);
    }
  }

  if (!isAuthenticated.value) {
    const redirectPath = to.fullPath !== '/' ? to.fullPath : '/admin';
    const loginUrl = `/login?redirect=${encodeURIComponent(redirectPath)}`;

    if (process.server) {
      return navigateTo(loginUrl, { redirectCode: 302, external: false, replace: true });
    } else {
      return navigateTo(loginUrl, { replace: true });
    }
  }
});
