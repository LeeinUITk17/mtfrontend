<template>
    <div class="py-4">
        <div class="flex justify-end mb-6">
            <NuxtLink
                to="/admin/posts/create"
                class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold shadow"
            >
                + Thêm bài viết mới
            </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Danh sách Bài viết</h3>
            <div v-if="postsPending" class="text-center">
                <LoadingSpinner class="w-8 h-8 text-blue-600 mx-auto" />
                <p>Đang tải danh sách bài viết...</p>
            </div>
            <div v-else-if="postsError" class="text-red-500">Lỗi: {{ postsError.message }}</div>
            <div v-else-if="posts && posts.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tác giả</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Ngày đăng</th>
                            <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="post in posts" :key="post.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <NuxtLink :to="`/admin/posts/${post.id}`" class="text-blue-600 hover:underline">{{ post.title }}</NuxtLink>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                                {{ post.user?.fullName || post.user?.username || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                                {{ post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <NuxtLink :to="`/admin/posts/${post.id}`" class="text-blue-600 hover:underline mr-3">Sửa</NuxtLink>
                                <button @click="confirmDelete(post.id)" class="text-red-600 hover:underline">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="text-gray-600 italic text-center py-12">Không có bài viết nào trong cơ sở dữ liệu.</div>
        </div>

        <AlertDialog
            :isOpen="showConfirmDialog"
            title="Xác nhận xóa bài viết"
            message="Bạn có chắc chắn muốn xóa bài viết này? Thao tác này không thể hoàn tác."
            @confirm="deletePost"
            @cancel="cancelDelete"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import AlertDialog from '~/components/common/AlertDialog.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const config = useRuntimeConfig();
const showConfirmDialog = ref(false);
const postToDeleteId = ref(null);

const { data: posts, pending: postsPending, error: postsError, refresh: fetchPosts } = await useAsyncData(
    'admin-posts-list',
    async () => {
        const response = await $fetch(`${config.public.apiBase}/posts`);
        return response || [];
    }
);

const confirmDelete = (postId) => {
    postToDeleteId.value = postId;
    showConfirmDialog.value = true;
};

const cancelDelete = () => {
    postToDeleteId.value = null;
    showConfirmDialog.value = false;
};

const deletePost = async () => {
    if (!postToDeleteId.value) return;

    try {
        await $fetch(`${config.public.apiBase}/posts/${postToDeleteId.value}`, { method: 'DELETE' });
        await fetchPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    } finally {
        cancelDelete();
    }
};

useHead({
    title: 'Quản lý Bài viết - Admin'
});
</script>

<style scoped>
</style>
