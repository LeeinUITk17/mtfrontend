<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Plant Management</h1>

        <div class="flex justify-end mb-6">
            <NuxtLink
                to="/admin/plants/create"
                class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold shadow"
            >
                + Add New Plant
            </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Plant List</h3>
            <div v-if="plantsPending" class="text-center">
                <LoadingSpinner />
                <p>Loading plant list...</p>
            </div>
            <div v-else-if="plantsError" class="text-red-500">
                Error: {{ plantsError.message }}
            </div>
            <div v-else-if="plants && plants.length > 0">
                <ul class="divide-y divide-gray-200">
                    <li v-for="plant in plants" :key="plant.id" class="py-3 flex items-center justify-between">
                        <span class="text-gray-800 font-medium">{{ plant.name }}</span>
                        <span class="text-gray-600 text-sm">{{ plant.stock }} in stock</span>
                        <div>
                            <NuxtLink :to="`/admin/plants/${plant.id}`" class="text-blue-600 hover:underline text-sm mr-3">Edit</NuxtLink>
                            <button @click="confirmDelete(plant.id)" class="text-red-600 hover:underline text-sm">Delete</button>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="text-gray-600 italic">No plants found in the database.</div>
        </div>
    </div>
</template>

<script setup>
import { useAsyncData } from '#app';
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const { data: plants, pending: plantsPending, error: plantsError, refresh: fetchPlants } = await useAsyncData(
    'admin-plants-list',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const samplePlants = [
            { id: 'p1', name: 'Monstera Deliciosa', stock: 10 },
            { id: 'p2', name: 'Snake Plant', stock: 25 },
            { id: 'p3', name: 'ZZ Plant', stock: 15 },
        ];
        return samplePlants;
    }
);

useHead({
    title: 'Plant Management - Admin',
});
</script>

<style scoped>
</style>
