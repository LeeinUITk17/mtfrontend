import { defineNuxtPlugin, useRuntimeConfig, navigateTo, useRequestHeaders } from '#app';
import { $fetch, FetchError, type FetchOptions, type FetchContext, type FetchResponse } from 'ofetch';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const pluginState = {
        isRefreshing: false,
        failedQueue: [] as Array<{ resolve: Function; reject: Function; options: FetchOptions & { url: string } }>,
    };

    function processQueue(error: any | null) {
        pluginState.failedQueue.forEach((prom) => {
            if (error) prom.reject(error);
            else prom.resolve();
        });
        pluginState.failedQueue.length = 0;
    }

    const apiFetch = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',

        async onRequest({ request, options }) {
            if (process.server) {
                const requestHeaders = useRequestHeaders(['cookie']);
                if (requestHeaders.cookie) {
                    options.headers = {
                        ...options.headers,
                        Cookie: requestHeaders.cookie,
                    };
                    options.credentials = 'omit';
                } else {
                    options.credentials = 'omit';
                }
            }
        },

        async onResponseError({ request, response, options }: FetchContext & { response: FetchResponse<any> }): Promise<void> {
            const originalRequestUrl = typeof request === 'string' ? request : new URL(request.url, options.baseURL).toString();
            const status = response.status;
            const opts = options as FetchOptions & { _retry?: boolean };

            if (status === 401 && originalRequestUrl.includes('/auth/') && !originalRequestUrl.includes('/auth/profile')) {
                const fetchError = new FetchError(`[${status}] ${response.statusText} on auth endpoint`);
                fetchError.response = response;
                throw fetchError;
            }

            if (status === 401 && !opts._retry) {
                if (pluginState.isRefreshing) {
                    try {
                        await new Promise((resolve, reject) => {
                            pluginState.failedQueue.push({ resolve, reject, options: { ...opts, url: originalRequestUrl } as any });
                        });
                        return apiFetch(originalRequestUrl, opts);
                    } catch (queuedError) {
                        throw queuedError;
                    }
                }

                opts._retry = true;
                pluginState.isRefreshing = true;

                try {
                    await apiFetch('/auth/refresh', { method: 'POST' });
                    processQueue(null);
                    return apiFetch(originalRequestUrl, opts);
                } catch (refreshError: any) {
                    processQueue(refreshError);
                    if (process.client) {
                        try {
                            const { logout } = useAuth();
                            await logout();
                            await navigateTo('/login', { replace: true });
                        } catch {
                            window.location.href = '/login';
                        }
                    }
                    throw refreshError;
                } finally {
                    pluginState.isRefreshing = false;
                }
            } else if (status === 401 && opts._retry) {
                if (process.client) {
                    try {
                        const { logout } = useAuth();
                        await logout();
                        await navigateTo('/login', { replace: true });
                    } catch {
                        window.location.href = '/login';
                    }
                }
                const fetchError = new FetchError(`[${status}] Unauthorized (after retry) - ${originalRequestUrl}`);
                fetchError.response = response;
                throw fetchError;
            }

            const fetchError = new FetchError(`[${response.status}] ${response.statusText} - ${originalRequestUrl}`);
            fetchError.response = response;
            throw fetchError;
        },
    });

    nuxtApp.provide('api', apiFetch);
});
