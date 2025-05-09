import { ref, computed } from 'vue';
import { useNuxtApp, useState } from '#app';
import type { $Fetch } from 'ofetch';

interface AuthUser {
    id: string;
    username: string;
    email: string;
}

let _api: $Fetch | null = null;

export const useAuth = () => {
    const user = useState<AuthUser | null>('authStateUser', () => null);
    const nuxtApp = useNuxtApp();

    if (!_api && nuxtApp.$api) {
        _api = nuxtApp.$api as $Fetch;
    }

    const isAuthenticated = computed(() => !!user.value);

    const fetchUser = async () => {
        if (!_api) return;

        try {
            const fetchedUser = await _api<AuthUser>('/auth/profile', { method: 'GET' });
            if (fetchedUser && typeof fetchedUser === 'object' && fetchedUser.id) {
                user.value = fetchedUser;
            } else {
                user.value = null;
            }
        } catch (error: any) {
            console.error('[useAuth] fetchUser API error:', error.message || error);
            user.value = null;
        }
    };

    const login = async (credentials: { identifier: string; password: string }) => {
        if (!_api) return { success: false, error: 'API client not ready.' };
        user.value = null;
        const loginData = { email: credentials.identifier, password: credentials.password };
        try {
            await _api<{ message?: string }>('/auth/login', { method: 'POST', body: loginData });
            await fetchUser();
            if (user.value) {
                return { success: true };
            } else {
                return { success: false, error: 'Login successful but failed to retrieve user session.' };
            }
        } catch (error: any) {
            console.error('[useAuth] Login API error:', error);
            user.value = null;
            const message = error.data?.message || error.message || 'Login failed. Please check your credentials.';
            return { success: false, error: message };
        }
    };

    const signup = async (signupData: { username: string; email: string; password: string }) => {
        if (!_api) return { success: false, error: 'API client not ready.' };
        user.value = null;
        try {
            await _api<{ message: string }>('/auth/signup', { method: 'POST', body: signupData });
            return { success: true };
        } catch (error: any) {
            console.error('[useAuth] Signup API error:', error);
            const message = error.data?.message || error.message || 'Signup failed. Please try again.';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        if (!_api) {
            console.warn('[useAuth] $api not available for logout, clearing state locally.');
            user.value = null;
            return;
        }
        try {
            await _api<{ message?: string }>('/auth/logout', { method: 'POST' });
        } catch (error: any) {
            console.error('[useAuth] Logout API error (ignoring):', error);
        } finally {
            user.value = null;
        }
    };

    return {
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        fetchUser,
    };
};
