<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="plantPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Loading plant information...</p>
        </div>

        <div v-else-if="plantError" class="text-center text-red-500 py-12">
            <p>Error loading plant information: {{ plantError.message }}</p>
            <p class="mt-2">Please try again later or contact support.</p>
        </div>

        <div v-else-if="!plant" class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Plant not found.</p>
            <p class="mt-2">The plant ID may be incorrect or the plant does not exist.</p>
            <NuxtLink to="/plants" class="mt-4 inline-block text-primary hover:underline">
                Back to plant list
            </NuxtLink>
        </div>

        <div v-else class="bg-white rounded-lg shadow-xl overflow-hidden p-6 md:p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div class="md:col-span-1">
                    <NuxtImg
                        v-if="plant.imageUrl"
                        :src="plant.imageUrl"
                        :alt="'Image of ' + plant.name"
                        class="w-full h-auto object-cover rounded-lg shadow-md"
                        sizes="sm:100vw md:50vw lg:400px"
                        quality="80"
                    />
                    <div v-else class="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        No image available
                    </div>
                </div>

                <div class="md:col-span-1 space-y-6">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold text-green-800">{{ plant.name }}</h1>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-green-700 mb-2">Description</h2>
                        <p class="text-gray-700 leading-relaxed">{{ plant.description || 'No detailed description available.' }}</p>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-green-700 mb-2">Price</h2>
                        <p class="text-2xl font-bold text-primary">{{ formatCurrency(plant.price) }}</p>
                    </div>

                    <div class="mt-8">
                        <button class="bg-primary text-green-500 text-lg font-semibold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors shadow-lg">
                            Call to Action
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useAsyncData } from '#app';
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const samplePlants = [
    { id: '1', name: 'Monstera Deliciosa', description: 'Popular and easy to care for, known for its unique split leaves.', price: 250000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '2', name: 'Calathea Orbifolia', description: 'Beautiful round, striped leaves that move with the light.', price: 180000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '3', name: 'Snake Plant', description: 'Very resilient and great at filtering indoor air pollutants. Ideal for beginners.', price: 100000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '4', name: 'Fiddle Leaf Fig', description: 'A trendy houseplant known for its large, violin-shaped leaves. Can be finicky.', price: 300000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '5', name: 'ZZ Plant', description: 'Extremely drought-tolerant and low-maintenance, perfect for low-light conditions.', price: 150000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '6', name: 'Peace Lily', description: 'Graceful plant with dark green leaves and elegant white flowers. Indicates when it needs water by drooping.', price: 120000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
];

const route = useRoute();
const plantId = route.params.id;

const { data: plant, pending: plantPending, error: plantError } = await useAsyncData(
    `plant-${plantId}`,
    async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return samplePlants.find(p => p.id === plantId);
    }
);

const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberValue);
};

useHead(() => {
    const plantName = plant.value ? plant.value.name : 'Plant';
    const description = plant.value ? plant.value.description : 'Detailed information about plants.';
    const imageUrl = plant.value && plant.value.imageUrl ? plant.value.imageUrl : '/social-share-image.jpg';

    return {
        title: `${plantName} - Plant Details`,
        meta: [
            { name: 'description', content: description },
            { property: 'og:title', content: `${plantName} - Plant Details` },
            { property: 'og:description', content: description },
            { property: 'og:image', content: imageUrl },
        ]
    };
});
</script>

<style scoped>
</style>
