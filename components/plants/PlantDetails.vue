<template>
    <div v-if="plant">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <img :src="plant.imageUrl || '/placeholder-plant-large.jpg'" :alt="plant.name" class="w-full h-96 object-cover rounded-lg shadow">
            </div>
            <div>
                <h1 class="text-3xl font-bold text-green-800 mb-4">{{ plant.name }}</h1>
                <p class="text-gray-700 text-lg mb-4">{{ plant.description }}</p>
                <p class="text-green-700 text-2xl font-bold mb-4">{{ plant.price }} VNĐ</p>
                <p class="text-gray-600 mb-4">Stock: {{ plant.stock }}</p>
                <CustomButton color="primary" size="lg" @click="$emit('addToCart', plant.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m0-3h-3m0 12a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    Add to Cart
                </CustomButton>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    plant: {
        type: Object,
        required: true
    }
});

const emits = defineEmits(['addToCart']);
</script>
