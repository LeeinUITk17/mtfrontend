<template>
    <NuxtLink :to="`/posts/${post.id}`" class="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ post.title }}</h3>
            <p class="text-sm text-gray-600 mb-3">Posted by: {{ post.user?.full_name || post.user?.username }} on {{ new Date(post.createdAt).toLocaleDateString() }}</p>
            <p class="text-gray-700 mb-3">{{ truncateContent(post.content) }}</p>
            <div class="flex items-center text-sm text-gray-500">
                <span>{{ post.rating || 0 }} votes</span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const truncateContent = (content) => {
    if (!content) return '';
    const maxLength = 150;
    if (content.length > maxLength) {
        return content.substring(0, maxLength) + '...';
    }
    return content;
};
</script>
