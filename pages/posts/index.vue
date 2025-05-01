<template>
    <div class="container mx-auto px-4 py-8">

        <div v-if="postsPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-blue-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải danh sách bài viết...</p>
        </div>

        <div v-else-if="postsError" class="text-center text-red-500 py-12">
            <p>Lỗi khi tải danh sách bài viết: {{ postsError.message }}</p>
            <p class="mt-2">Vui lòng thử lại sau.</p>
        </div>

        <div v-else-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <NuxtLink
                v-for="post in posts"
                :key="post.id"
                :to="`/posts/${post.id}`"
                class="block"
            >
                <PostPreview :post="post" />
            </NuxtLink>
        </div>

        <div v-else class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Chưa có bài viết nào trên diễn đàn.</p>
            <p class="mt-2" v-if="isAdmin">Hãy là người đầu tiên tạo bài viết!</p>
            <p class="mt-2" v-else>Hãy quay lại sau để xem các bài viết mới!</p>
        </div>
    </div>
</template>

<script setup>
import { useAsyncData } from '#app';
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PostPreview from '~/components/posts/PostPreview.vue';

const samplePosts = [
    {
        id: 'p1',
        title: '5 Mẹo chăm sóc Monstera',
        content: '<p>Monstera là loại cây rất phổ biến... Dưới đây là một vài mẹo:</p>',
        userId: 'user1-id',
        user: { id: 'user1-id', username: 'john_d', fullName: 'John Doe', avatar: 'https://via.placeholder.com/150?text=JD' },
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 15,
        images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }],
    },
    {
        id: 'p2',
        title: 'Cách tưới nước cho cây mọng nước',
        content: 'Cây mọng nước cần lượng nước vừa đủ, không quá nhiều, không quá ít...',
        userId: 'user2-id',
        user: { id: 'user2-id', username: 'plant_lover', avatar: 'https://via.placeholder.com/150?text=PL' },
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 8,
        images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }],
    },
    {
        id: 'p3',
        title: 'Chọn chậu phù hợp',
        content: 'Kích thước và chất liệu rất quan trọng...',
        userId: 'user1-id',
        user: { id: 'user1-id', username: 'john_d', fullName: 'John Doe', avatar: 'https://via.placeholder.com/150?text=JD' },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 5,
        images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }],
    },
    {
        id: 'p4',
        title: 'Sâu bệnh và bệnh hại phổ biến',
        content: 'Phát hiện và xử lý sâu bệnh sớm...',
        userId: 'user2-id',
        user: { id: 'user2-id', username: 'plant_lover', avatar: 'https://via.placeholder.com/150?text=PL' },
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 3,
        images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }],
    },
];

const isAdmin = ref(true);

const { data: posts, pending: postsPending, error: postsError } = await useAsyncData(
    'all-posts-list',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return samplePosts;
    }
);

useHead({
    title: 'Diễn đàn Cây cảnh - Plant Shop',
    meta: [
        { name: 'description', content: 'Đọc các bài viết và mẹo chăm sóc cây cảnh từ cộng đồng của chúng tôi.' },
        { property: 'og:title', content: 'Diễn đàn Cây cảnh - Plant Shop' },
        { property: 'og:description', content: 'Đọc các bài viết và mẹo chăm sóc cây cảnh từ cộng đồng của chúng tôi.' },
        { property: 'og:image', content: '/social-share-image.jpg' },
        { property: 'og:url', content: 'http://localhost:8080/posts' },
    ],
});
</script>

<style scoped>
</style>
