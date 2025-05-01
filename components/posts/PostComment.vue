<template>
    <div class="border-b border-gray-200 py-4">
        <p class="font-semibold text-gray-800">{{ comment.user?.full_name || comment.user?.username }}</p>
        <p class="text-gray-700 mt-1">{{ comment.content }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ new Date(comment.createdAt).toLocaleDateString() }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    comment: {
        type: Object,
        required: true
    }
});
</script>
