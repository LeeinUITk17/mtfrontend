<template>
    <NuxtLink :to="`/posts/${post.id}`" class="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
        <div v-if="post.images && post.images.length > 0" class="relative w-full overflow-hidden">
            <NuxtImg
                :src="post.images[0].url"
                :alt="'Image for post: ' + post.title"
                class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:300px"
            />
            <div class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
        </div>
        <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Không có ảnh
        </div>
        <div class="p-4 flex-grow flex flex-col">
            <h3 class="text-xl font-semibold text-gray-800 mb-2 leading-tight">{{ post.title }}</h3>
            <p class="text-sm text-gray-600 mb-3">Đăng bởi: <span class="font-medium">{{ post.user?.fullName || post.user?.username }}</span> vào ngày {{ post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'Không rõ' }}</p>
            <p class="text-gray-700 mb-3 flex-grow">{{ truncateContent(post.content) }}</p>
            <div class="flex items-center text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                <span>{{ post.rating || 0 }} lượt thích</span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

const truncateContent = (content: string | null | undefined) => {
    if (!content) return '';
    const plainTextContent = content.replace(/<[^>]*>/g, '');
    const maxLength = 120;
    if (plainTextContent.length > maxLength) {
        return plainTextContent.substring(0, maxLength) + '...';
    }
    return plainTextContent;
};
</script>

<style scoped>
</style>
