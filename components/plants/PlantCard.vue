<template>
    <NuxtLink
        :to="`/plants/${plant.id}`"
        class="block border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-white"
    >
        <div v-if="plant.imageUrl" class="relative w-full h-48 md:h-56 overflow-hidden">
            <NuxtImg
                :src="plant.imageUrl"
                :alt="plant.name || 'Ảnh cây trồng'"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:300px"
            />
            <div class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
        </div>
        <div v-else class="w-full h-48 md:h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Không có ảnh
        </div>
        <div class="p-4 flex-grow flex flex-col">
            <h3 class="text-lg font-semibold text-gray-800 mb-1 leading-tight truncate">
                {{ plant.name }}
            </h3>
            <p v-if="plant.price != null" class="text-base font-bold text-green-600">
                {{ formatCurrency(plant.price) }}
            </p>
        </div>
    </NuxtLink>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    plant: {
        type: Object,
        required: true,
        validator: (value) =>
            value && typeof value === 'object' && typeof value.name === 'string',
    },
});

const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(numberValue);
};
</script>

<style scoped>
</style>
