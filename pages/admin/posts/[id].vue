<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Post</h1>
        <div v-if="postPending">
            <LoadingSpinner />
            <p>Loading post...</p>
        </div>
        <div v-else-if="postError">
            Error: {{ postError.message }}
        </div>
        <div v-else-if="post" class="bg-white rounded-lg shadow p-6">
            <PostForm :initial-data="post" />
        </div>
        <div v-else class="text-gray-600 italic">Post not found.</div>
    </div>
</template>

<script setup>
import { useRoute, useAsyncData } from '#app';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PostForm from '~/components/posts/PostForm.vue';

definePageMeta({ layout: 'admin', middleware: ['auth'] });

const route = useRoute();
const postId = route.params.id;

const { data: post, pending: postPending, error: postError } = await useAsyncData(
    `admin-post-${postId}`,
    async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const samplePosts = [
            { id: 'p1', title: 'Monstera Care Tips', content: 'Full content here...' }
        ];
        const found = samplePosts.find(p => p.id === postId);
        return found;
    }
);
</script>