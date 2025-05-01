<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Manage Posts</h1>

        <div class="flex justify-end mb-6">
            <NuxtLink
                to="/admin/posts/create"
                class="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold shadow"
            >
                + Add New Post
            </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Post List</h3>
            <div v-if="postsPending" class="text-center">
                <LoadingSpinner />
                <p>Loading post list...</p>
            </div>
            <div v-else-if="postsError" class="text-red-500">Error: {{ postsError.message }}</div>
            <div v-else-if="posts && posts.length > 0">
                <ul class="divide-y divide-gray-200">
                    <li v-for="post in posts" :key="post.id" class="py-3 flex items-center justify-between">
                        <span class="text-gray-800 font-medium">{{ post.title }}</span>
                        <div class="text-sm text-gray-600">{{ post.user?.username }}</div>
                        <div>
                            <NuxtLink :to="`/admin/posts/${post.id}`" class="text-blue-600 hover:underline text-sm mr-3">Edit</NuxtLink>
                            <button @click="confirmDelete(post.id)" class="text-red-600 hover:underline text-sm">Delete</button>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="text-gray-600 italic">No posts available in the database.</div>
        </div>
    </div>
</template>

<script setup>
import { useAsyncData } from '#app';
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const { data: posts, pending: postsPending, error: postsError, refresh: fetchPosts } = await useAsyncData(
    'admin-posts-list',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const samplePosts = [
            { id: 'p1', title: 'Monstera Care Tips', userId: 'user1', user: { username: 'john_d' } },
            { id: 'p2', title: 'Watering Succulents', userId: 'user2', user: { username: 'plant_lover' } },
        ];
        return samplePosts;
    }
);

const confirmDelete = (postId) => {
    console.log('Confirm delete post:', postId);
};
</script>