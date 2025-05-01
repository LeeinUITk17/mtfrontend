<template>
    <div class="bg-gray-100 rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Các bài viết khác của tác giả</h3>
        <ul class="space-y-3">
            <li v-for="relatedPost in relatedPosts" :key="relatedPost.id">
                <NuxtLink :to="`/posts/${relatedPost.id}`" class="block text-gray-700 hover:text-blue-600 hover:underline transition-colors">
                    {{ relatedPost.title }}
                </NuxtLink>
            </li>
            <li v-if="!relatedPosts || relatedPosts.length === 0" class="text-gray-500 italic">Chưa có bài viết liên quan nào khác.</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface RelatedPost {
    id: string;
    title: string;
}

const props = defineProps<{
    relatedPosts: RelatedPost[];
}>();
</script>

<style scoped>
</style>
