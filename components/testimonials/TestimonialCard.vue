<template>
    <div class="p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
            <div>
                <p class="font-semibold text-gray-800">{{ testimonial.customerName }}</p>
                <p class="text-sm text-gray-500">{{ testimonial.customerTitle }}</p>
            </div>
        </div>
        <p class="text-gray-700 italic">"{{ testimonial.content }}"</p>
    </div>
</template>

<script setup>
const props = defineProps({
    testimonial: {
        type: Object,
        required: true
    }
});
</script>
