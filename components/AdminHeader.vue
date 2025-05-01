<template>
    <div class="flex items-center justify-between px-4 py-3">
        <div class="text-xl font-semibold text-gray-800">
            Dashboard
        </div>
        <div class="flex items-center space-x-4">
            <span class="text-gray-700 text-sm hidden sm:block">Hello, <span class="font-semibold">{{ user?.fullName || user?.username || 'Admin' }}</span></span>
            <button @click="handleLogout" class="text-sm text-red-600 hover:underline">
                Logout
            </button>
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
