<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Trees</h3>
                <p class="text-3xl font-bold text-green-600">150</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">New Posts This Week</h3>
                <p class="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Pending Orders</h3>
                <p class="text-3xl font-bold text-orange-600">5</p>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});
</script>

<style scoped>
</style>
