<template>
    <article class="prose lg:prose-xl max-w-none">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{{ post.title }}</h1>

        <div class="text-sm text-gray-600 mb-6 border-b pb-4">
            <p>Ngày đăng: {{ post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'Không rõ' }}</p>
        </div>

        <p v-if="typeof post.content === 'string' && !post.content.includes('<')" class="text-gray-700 leading-relaxed">{{ post.content }}</p>
        <div v-else-if="typeof post.content === 'string'" class="text-gray-700 leading-relaxed" v-html="post.content"></div>
        <p v-else class="text-gray-600 italic">Chưa có nội dung bài viết.</p>
    </article>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Post {
    id: string;
    title: string;
    content?: string | null;
    userId: string;
    user?: {
        id: string;
        username: string;
        fullName?: string | null;
        avatar?: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    rating: number;
    images?: {
        id: string;
        url: string;
    }[];
}

const props = defineProps<{
    post: Post;
}>();
</script>

<style scoped>
</style>
