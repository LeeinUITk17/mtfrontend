<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Create New Post</h1>
        <div class="bg-white rounded-lg shadow p-6">
            <PostForm />
        </div>
    </div>
</template>

<script setup>
import PostForm from '~/components/posts/PostForm.vue';
definePageMeta({ layout: 'admin', middleware: ['auth'] });
</script>