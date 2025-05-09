import { useAuth } from '~/composables/useAuth';
import { navigateTo, defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = useAuth();
  const nuxtApp = useNuxtApp();

  if (isAuthenticated.value) {
    if (process.client) {
      return navigateTo('/admin', { replace: true });
    } else if (process.server && nuxtApp.ssrContext?.event.node.res) {
      nuxtApp.ssrContext.event.node.res.writeHead(302, { Location: '/admin' });
      nuxtApp.ssrContext.event.node.res.end();
      return;
    }
  }
});
