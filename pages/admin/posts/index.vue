<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Quản lý Bài viết</h1>
        <div class="flex justify-end mb-6">
            <NuxtLink
                to="/admin/posts/create"
                class="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium shadow text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Thêm bài viết mới
            </NuxtLink>
        </div>

        <div v-if="deleteMessage" class="mb-4 p-3 rounded-md text-sm font-medium" :class="deleteError ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'">
            {{ deleteMessage }}
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div v-if="postsPending" class="text-center p-10">
                <LoadingSpinner class="w-8 h-8 text-blue-600 mx-auto" />
                <p class="mt-2 text-sm text-gray-500">Đang tải danh sách bài viết...</p>
            </div>
            <div v-else-if="postsError" class="text-red-500 p-6 text-center">Lỗi: {{ postsError.message }}</div>
            <div v-else-if="allPosts && allPosts.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tác giả</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày đăng</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="post in paginatedPosts" :key="post.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <NuxtLink :to="`/admin/posts/${post.id}`" class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                    {{ post.title }}
                                </NuxtLink>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                                {{ post.user?.name || post.user?.email || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                {{ formatDate(post.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                                <span :class="ratingBadgeClass(post.rating)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    {{ formatRateLevel(post.rating) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <NuxtLink :to="`/admin/posts/${post.id}`" class="text-indigo-600 hover:text-indigo-900">Sửa</NuxtLink>
                                <button @click="confirmDelete(post.id, post.title)" class="text-red-600 hover:text-red-900">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="text-gray-500 italic text-center py-12">Không có bài viết nào.</div>
        </div>

        <div v-if="!postsPending && totalPages > 1" class="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div class="text-sm text-gray-600">
                Trang <span class="font-medium">{{ currentPage }}</span> / <span class="font-medium">{{ totalPages }}</span> (Tổng số <span class="font-medium">{{ allPosts.length }}</span> bài viết)
            </div>
            <div class="flex justify-center items-center space-x-1">
                <button @click="goToPage(1)" :disabled="currentPage === 1" class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">«</button>
                <button @click="prevPage" :disabled="currentPage === 1" class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">‹</button>
                <button
                    v-for="page in paginationButtons" :key="page" @click="goToPage(page)"
                    :class="{'bg-blue-600 text-white border-blue-600 z-10': currentPage === page, 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300': currentPage !== page}"
                    class="px-3 py-1 border rounded-md text-sm font-medium transition-colors"
                >{{ page }}</button>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">›</button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">»</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const config = useRuntimeConfig();
const isDeleting = ref(false);
const deleteMessage = ref(null);
const deleteError = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const { data: allPosts, pending: postsPending, error: postsError, refresh: refreshPosts } = await useAsyncData(
    'admin-posts-list-all-client',
    async () => {
        try {
            const fetchedPosts = await $fetch(`${config.public.apiBase}/posts`);
            if (!Array.isArray(fetchedPosts)) return [];
            return fetchedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (err) {
            Swal.fire('Lỗi!', 'Không thể tải danh sách bài viết.', 'error');
            return [];
        }
    },
    { default: () => [] }
);

const totalPages = computed(() => {
    if (!allPosts.value || allPosts.value.length === 0) return 0;
    return Math.ceil(allPosts.value.length / itemsPerPage.value);
});

const paginatedPosts = computed(() => {
    if (!allPosts.value || allPosts.value.length === 0) return [];
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return allPosts.value.slice(startIndex, endIndex);
});

const paginationButtons = computed(() => {
    const current = currentPage.value, total = totalPages.value, delta = 2;
    const range = [1, ...Array.from({ length: Math.min(total - 2, delta * 2 + 1) }, (_, i) => Math.max(2, current - delta) + i)];
    if (total > 1) range.push(total);
    const rangeWithDots = range.reduce((acc, val, i, arr) => {
        if (i > 0 && val - arr[i - 1] > 1) acc.push('...');
        acc.push(val);
        return acc;
    }, []);
    return rangeWithDots.filter((page, index, self) => typeof page === 'string' || self.indexOf(page) === index).filter((page, index, self) => {
        if (typeof page === 'number') return true;
        return !(index > 0 && self[index - 1] === '...' || index < self.length - 1 && self[index + 1] === '...');
    });
});

watch(allPosts, (newVal, oldVal) => {
    if (newVal && newVal.length !== oldVal?.length) {
        const newTotalPages = Math.ceil(newVal.length / itemsPerPage.value);
        if (currentPage.value > newTotalPages && newTotalPages > 0) {
            currentPage.value = newTotalPages;
        } else if (currentPage.value > 1 && newTotalPages === 0) {
            currentPage.value = 1;
        }
    }
}, { deep: true });

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString));
    } catch (e) {
        return 'Invalid Date';
    }
};

const formatRateLevel = (level) => {
    switch (level) {
        case 'low': return 'Thấp';
        case 'medium': return 'Trung bình';
        case 'high': return 'Cao';
        default: return level || 'N/A';
    }
};

const ratingBadgeClass = (level) => {
    switch (level) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const confirmDelete = (postId, postTitle) => {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa bài viết "${postTitle}"? Thao tác này sẽ xóa cả các hình ảnh liên quan và không thể hoàn tác.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đúng, xóa nó!',
        cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
        if (result.isConfirmed) {
            handleDeletePost(postId);
        }
    });
};

const handleDeletePost = async (postId) => {
    if (!postId) return;
    isDeleting.value = true;
    deleteMessage.value = null;
    deleteError.value = false;
    try {
        await $fetch(`${config.public.apiBase}/posts/${postId}`, { method: 'DELETE' });
        deleteMessage.value = `Bài viết (ID: ${postId}) đã được xóa thành công!`;
        deleteError.value = false;
        Swal.fire('Đã xóa!', 'Bài viết đã được xóa.', 'success');
        await refreshPosts();
    } catch (err) {
        const message = err.data?.message || 'Không thể xóa bài viết.';
        deleteMessage.value = `Lỗi: ${message}`;
        deleteError.value = true;
        Swal.fire('Lỗi!', message, 'error');
    } finally {
        isDeleting.value = false;
        setTimeout(() => { deleteMessage.value = null; deleteError.value = false; }, 7000);
    }
};

const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value && pageNumber !== currentPage.value && typeof pageNumber === 'number') {
        currentPage.value = pageNumber;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

</script>

<style scoped>
</style>
