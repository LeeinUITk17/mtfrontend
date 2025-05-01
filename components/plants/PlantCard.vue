<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <div v-if="plant.imageUrl" class="relative">
            <img
                :src="plant.imageUrl"
                :alt="plant.name || 'Plant image'"
                class="w-full h-48 object-cover"
            />
        </div>
        <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
        </div>

        <div class="p-4 flex-grow">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ plant.name }}</h3>
        </div>

        <div class="p-4 border-t border-gray-200">
            <button class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm">
                View Details
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    plant: {
        type: Object,
        required: true,
        validator: (value) => value && typeof value.name === 'string',
    },
});
</script>

<style scoped>
</style>
