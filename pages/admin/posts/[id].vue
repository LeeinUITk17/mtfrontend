<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Sửa bài viết</h1>

        <div v-if="postPending" class="text-center">
            <LoadingSpinner class="w-8 h-8 text-blue-600 mx-auto" />
            <p class="mt-4">Đang tải bài viết...</p>
        </div>
        <div v-else-if="postError" class="text-red-500">Lỗi: {{ postError.message }}</div>
        <div v-else-if="!post" class="text-gray-600 italic">Không tìm thấy bài viết này.</div>

        <div v-else class="bg-white rounded-lg shadow p-6">
            <PostForm :initial-data="post" />
        </div>
    </div>
</template>

<script setup>
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PostForm from '~/components/posts/PostForm.vue';

definePageMeta({ layout: 'admin', middleware: ['auth'] });

const config = useRuntimeConfig();
const route = useRoute();
const postId = route.params.id;

const { data: post, pending: postPending, error: postError } = await useAsyncData(
    `admin-post-${postId}`,
    async () => {
        const response = await $fetch(`${config.public.apiBase}/posts/${postId}`);
        if (!response) {
            console.warn(`Post with ID ${postId} not found or empty response.`);
            return null;
        }
        return response;
    }
);

useHead(() => {
    const postTitle = post.value ? post.value.title : 'Sửa bài viết';
    return {
        title: `${postTitle} - Sửa bài viết - Admin`,
    };
});
</script>
