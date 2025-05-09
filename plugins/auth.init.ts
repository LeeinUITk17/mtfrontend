import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
    const { user, fetchUser } = useAuth();

    if (user.value === undefined || user.value === null) {
        try {
            const context = process.server ? 'server' : 'client';
            console.log(`[Auth Init Plugin] Initializing user state on ${context}...`);
            await fetchUser();
            console.log(`[Auth Init Plugin] User state after fetch on ${context}:`, user.value ? user.value.id : 'null');
        } catch (error) {
            console.error('[Auth Init Plugin] Error during initial user fetch:', error);
        }
    }
});
