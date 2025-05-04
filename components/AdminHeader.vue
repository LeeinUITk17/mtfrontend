<template>
    <div class="flex items-center justify-between px-4 py-3">
        <div class="text-xl font-semibold text-gray-800">
            Dashboard
        </div>

        <div class="flex items-center space-x-4">
            <client-only>
                <span class="text-gray-700 text-sm hidden sm:block">
                    Chào, <span class="font-semibold">{{ user?.fullName || user?.username || 'Admin' }}</span>
                </span>
                <template #fallback>
                    <span class="text-gray-700 text-sm hidden sm:block">Chào, <span class="font-semibold">Đang tải...</span></span>
                </template>
            </client-only>

            <client-only>
                <button @click="handleLogout" class="text-sm text-red-600 hover:underline">
                    Đăng xuất
                </button>
                <template #fallback>
                    <span class="text-sm text-gray-600">Đang tải...</span>
                </template>
            </client-only>
        </div>
    </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';
import { navigateTo } from '#app';

const { user, logout } = useAuth();

const handleLogout = async () => {
    await logout();
    await navigateTo('/');
};
</script>

<style scoped>
</style>
