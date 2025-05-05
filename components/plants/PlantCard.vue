<template>
    <NuxtLink
        :to="`/plants/${plant.id}`"
        class="block border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-white group"
    >
        <div v-if="plant.images?.length > 0 && plant.images[0].url" class="relative w-full h-48 md:h-56 overflow-hidden">
            <NuxtImg
                :src="plant.images[0].url"
                :alt="plant.name || 'Ảnh cây trồng'"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:300px"
                :modifiers="{ format: 'webp', quality: '80' }"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div v-else class="w-full h-48 md:h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border-b border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <div class="p-4 flex-grow flex flex-col justify-between">
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-1 leading-tight group-hover:text-green-700 transition-colors duration-200">
                    <span class="block truncate" :title="plant.name">{{ plant.name }}</span>
                </h3>
            </div>
            <p v-if="plant.price != null" class="text-base font-bold text-green-600 mt-2">
                {{ formatCurrency(plant.price) }}
            </p>
        </div>
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    plant: {
        type: Object,
        required: true,
        validator: (value) =>
            value &&
            typeof value === 'object' &&
            typeof value.id === 'string' &&
            typeof value.name === 'string' &&
            value.price !== undefined &&
            (value.images === undefined || value.images === null || Array.isArray(value.images))
    },
});

const formatCurrency = (value) => {
    if (value == null || value === undefined) return '';
    const numberValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(numberValue);
};
</script>

<style scoped>
.group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
}
.group:hover .group-hover\:text-green-700 {
    color: #047857;
}
.group:hover .group-hover\:opacity-100 {
    opacity: 1;
}
</style>
